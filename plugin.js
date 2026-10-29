const {LANGUAGES,TRANSLATIONS,locale}=require('./i18n');
const {Plugin,ItemView,Modal,PluginSettingTab,Setting,MarkdownView,MarkdownRenderChild,Notice,editorInfoField,getLanguage}=require('obsidian');
const {ViewPlugin,Decoration}=require('@codemirror/view');
const {StateEffect}=require('@codemirror/state');
const {PALETTE,anchor,resolve,place,rgba,upsert,segments,selectedMark,projectMarkdown,visibleMap,migrateData,slotHex,paletteSide,highlightOutline,outlineMarkdown,matchesHighlightFilter,badgeInk,flatHighlightGroups,softStyleBadge,dismissSheet,editorSelectionBounds}=require('./core');
const TYPE='easy-text-highlights';
const refresh=StateEffect.define();
// Independently drawn SVG paths, no external icon/font dependency.
const ICONS={
 filter:[['path',{d:'M4 5h20l-8 9v9l-4-2v-7z'}]],
 check:[['path',{d:'m6 14 5 5L23 7'}]],
 reset:[['path',{d:'M6 10a9 9 0 1 1 0 10M6 4v7h7'}]],
 close:[['path',{d:'m7 7 14 14M21 7 7 21'}]],
 export:[['path',{d:'M14 18V4m-5 5 5-5 5 5M6 15v9h16v-9'}]],
 markdown:[['path',{d:'M7 3h10l5 5v17H7zM17 3v6h5M10 20v-7l3 4 3-4v7M18 15v5m-2-2 2 2 2-2'}]],
 copy:[['path',{d:'M9 8V4h13v15h-4M5 9h12v15H5z'}],['path',{d:'M8 13h6M8 17h4'}]],
 highlight:[['path',{d:'m7 15 8-10 7 6-8 10-7-6zM7 15l-3 7 7-3'}],['path',{d:'M5 25h18',class:'aih-icon-accent'}]],
 wave:[['path',{d:'M5 14c3-9 6 9 9 0s6 9 9 0',class:'aih-icon-accent'}],['path',{d:'M5 23h18',class:'aih-icon-guide'}]],
 underline:[['path',{d:'M8 5v8a6 6 0 0 0 12 0V5'}],['path',{d:'M5 24h18',class:'aih-icon-accent'}]]};
function icon(el,kind,removing=false){const ns='http://www.w3.org/2000/svg',svg=el.ownerDocument.createElementNS(ns,'svg');for(const [k,v] of Object.entries({viewBox:'0 0 28 28',width:28,height:28,fill:'none',stroke:'currentColor','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(k,v);for(const [tag,attrs] of ICONS[kind]){const n=el.ownerDocument.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);svg.append(n);}if(removing){const slash=el.ownerDocument.createElementNS(ns,'path');slash.setAttribute('d','M4 4l20 20');slash.setAttribute('class','aih-icon-slash');svg.append(slash);}el.append(svg);}
const words={
 deselectAll:['Deselect All','取消全選'],
 filterTitle:['Filter your highlights','篩選你的摘錄'],
 swipeClose:['Drag down to close','向下拖曳關閉'],
 exportHighlights:['Export highlights','匯出摘錄'],markdownFile:['Create Markdown','建立 Markdown'],selectAll:['Select All','全選'],selected:['selected','筆已選'],cancel:['Cancel','取消'],selectExport:['Select highlights to export.','選取要匯出的摘錄。'],exportFailed:['Could not export highlights. Please try again.','無法匯出摘錄，請再試一次。'],noteChanged:['Note changed. Please select highlights again.','筆記已切換，請重新選取摘錄。'],created:['Markdown file created','已建立 Markdown 檔案'],
 filter:['Filter','篩選'],filterTypes:['Types','劃線類型'],filterColors:['Colors','顏色'],filterHint:['No selection means all.','不選即顯示全部。'],confirm:['Confirm','確定'],reset:['Reset','重設'],matches:['matching highlights','筆符合條件'],noMatches:['No highlights match these filters.','沒有符合條件的摘錄。'],
 copyHighlights:['Copy highlights','複製摘錄'],openNote:['Open a note to see its highlights.','開啟筆記即可查看摘錄。'],items:['highlights','筆摘錄'],copyFailed:['Could not copy highlights. Please try again.','無法複製摘錄，請再試一次。'],
 syncColors:['Changing a slot updates every highlight using it, including the sidebar.','修改色格會同步更新所有使用它的劃線與右側摘錄。'],styles:['Styles','樣式'],title:['Highlights','螢光標記'],mark:['Highlight','劃線'],remove:['Remove highlight','刪除劃線'],copy:['Copy','複製'],close:['Close','關閉'],
 custom:['Custom color','自選顏色'],highlight:['Highlighter','馬克筆'],underline:['Underline','下劃線'],wave:['Wavy underline','波浪線'],current:['This note','目前筆記'],all:['All notes','全部筆記'],
 empty:['Select text in a note, then choose Highlight.','選取筆記文字，再按「劃線」。'],missing:['Original text changed; locate manually.','原文已變動，請手動確認。'],
 language:['Language','語言'],defaultColor:['Default color','預設顏色'],defaultStyle:['Default style','預設樣式'],width:['Line thickness','線條粗細'],opacity:['Background opacity','底色不透明度'],palette:['Colors · ribbon palette','顏色 · 緞帶色盤'],
 swatches:['Toolbar colors','工具列配色'],slot:['Color','顏色'],height:['Highlight height','螢光底色高度'],scope:['Show highlights from','標記範圍'],export:['Export highlights','匯出標記'],unsupported:['Select plain text within one paragraph in Reading view, or use Editing view.','閱讀模式請選取同一段落內的純文字，或改用編輯模式。'],
 overlapping:['This selection overlaps another highlight. Edit or remove that highlight first.','此範圍與其他標記重疊，請先修改或刪除原有標記。'],
 saved:['Highlights stay in this vault’s plugin data. Notes remain unchanged. Back up data.json with your vault.','標記儲存在此庫的插件資料，筆記原文不變。請連同 data.json 備份。'],
 copied:['Copied','已複製'],failed:['Could not save highlights. Keep the plugin enabled and try again.','標記儲存失敗，請保持插件啟用並重試。']
};
class Highlighter extends Plugin {
 async onload(){
  const original=await this.loadData()||{};const data=migrateData(original);this.settings=data.settings;
  if(original.schema!==2&&original.records?.length&&this.manifest?.dir&&this.app.vault.adapter?.write){
   const backup=this.manifest.dir+'/data-before-five-slots.json';
   if(!await this.app.vault.adapter.exists(backup))await this.app.vault.adapter.write(backup,JSON.stringify(original,null,2));
  }
  this.records=data.records.filter(r=>typeof r.id==='string'&&typeof r.path==='string'&&typeof r.quote==='string'&&r.quote.length&&Number.isInteger(r.from)&&Number.isInteger(r.to)&&r.from>=0&&r.to>r.from&&['highlight','underline','wave'].includes(r.style)&&PALETTE.some(c=>c.id===r.color));
  this.dialogs=new Set();this.liveSections=new Map();this.undoStack=[];this.redoStack=[];this.undoArmed=false;this.sections=new Set();this.editors=new Set();this.saveChain=Promise.resolve();this.revision=0;this.selectionToken=0;this.unloading=false;
  this.registerView(TYPE,leaf=>new HighlightsView(leaf,this));
  this.addSettingTab(new HighlightSettings(this.app,this));
  this.addRibbonIcon('highlighter',this.t('title'),()=>this.openPanel());
  this.addCommand({id:'open-highlights',name:'Open highlights / 開啟螢光標記',callback:()=>this.openPanel()});
  this.addCommand({id:'highlight-selection',name:this.t('mark'),editorCallback:(editor,view)=>{
   const from=editor.posToOffset(editor.getCursor('from')),to=editor.posToOffset(editor.getCursor('to'));
   if(from<to&&view.file){this.pending={path:view.file.path,...anchor(editor.getValue(),from,to)};this.apply();}
  }});
  this.addCommand({id:'copy-highlights',name:this.t('copyHighlights'),callback:()=>this.copyHighlights()});
  const owner=this;
  this.registerEditorExtension(ViewPlugin.fromClass(class {
   constructor(view){this.view=view;owner.editors.add(view);this.decorations=this.build();owner.scheduleLiveCallouts();}
   build(){
    const path=this.view.state.field(editorInfoField,false)?.file?.path; const text=this.view.state.doc.toString();const ranges=[];
    const positioned=owner.records.filter(r=>r.path===path).map(r=>{const p=resolve(r,text);return p?{...p,r}:null;}).filter(Boolean);
    for(const {from,to,r} of segments(positioned)){
     for(let pos=from;pos<to;){const line=this.view.state.doc.lineAt(pos);const end=Math.min(to,line.to);if(end>pos)ranges.push(Decoration.mark({class:`aih-mark aih-${r.style}`,attributes:{style:owner.markStyle(r),'data-aih-id':r.id}}).range(pos,end));pos=end+1;}
    }
    return Decoration.set(ranges,true);
   }
   update(u){
    if(u.docChanged||u.viewportChanged||u.transactions.length)owner.scheduleLiveCallouts();
    if(u.docChanged){
     owner.undoArmed=false;
     const path=u.startState.field(editorInfoField,false)?.file?.path;const old=u.startState.doc.toString(),next=u.state.doc.toString();let changed=false;
     for(const r of owner.records.filter(r=>r.path===path)){
      const relocated=resolve(r,next);
      if(relocated){Object.assign(r,anchor(next,relocated.from,relocated.to));changed=true;continue;}
      const p=resolve(r,old);if(!p)continue;
      let replacedEntireRange=false;
      u.changes.iterChangedRanges((a,b)=>{if(a<=p.from&&b>=p.to)replacedEntireRange=true;});
      // A disk reload/full replacement must not delete annotations. Keep an unresolved
      // anchor so undo or restoring the original passage can recover it.
      if(replacedEntireRange)continue;
      const from=u.changes.mapPos(p.from,1),to=u.changes.mapPos(p.to,-1);
      if(to>from){Object.assign(r,anchor(next,from,to));changed=true;}
     }
     if(changed){owner.scheduleSave();owner.schedulePanels();}
    }
    if(u.docChanged||u.viewportChanged||u.transactions.some(t=>t.effects.some(e=>e.is(refresh))))this.decorations=this.build();
   }
   destroy(){owner.editors.delete(this.view);}
  },{decorations:v=>v.decorations}));
  this.registerMarkdownPostProcessor((el,ctx)=>{
   if(!ctx.sourcePath)return;const entry={el,ctx};this.sections.add(entry);
   const child=new MarkdownRenderChild(el);child.onunload=()=>this.sections.delete(entry);ctx.addChild(child);
   void this.renderSection(entry);
  });
  const doc=this.app.workspace.containerEl.ownerDocument;this.doc=doc;
  if(doc.defaultView.MutationObserver){const observer=new doc.defaultView.MutationObserver(changes=>{if(changes.some(change=>[...change.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.callout')||n.querySelector?.('.callout')))))this.scheduleLiveCallouts();});observer.observe(this.app.workspace.containerEl,{childList:true,subtree:true});this.register(()=>observer.disconnect());}
  const schedule=()=>{if(this.toolbar)return;clearTimeout(this.selectionTimer);this.selectionTimer=setTimeout(()=>void this.capture(),180);};
  this.registerDomEvent(doc,'selectionchange',schedule);
  this.registerDomEvent(doc,'beforeinput',()=>{this.undoArmed=false;},true);
  this.registerDomEvent(doc,'paste',()=>{this.undoArmed=false;this.hide();},true);
  this.registerDomEvent(doc,'cut',()=>{this.undoArmed=false;this.hide();},true);
  this.registerDomEvent(doc,'keydown',e=>{if(this.handleHistoryKey(e))return;if(!this.toolbar?.contains(e.target)&&e.key!=='Shift'&&e.key!=='Control'&&e.key!=='Meta'&&e.key!=='Alt')this.hide();},true);
  this.registerDomEvent(doc,'pointerup',e=>{if(!this.toolbar?.contains(e.target))schedule();},true);
  this.registerDomEvent(doc,'keyup',e=>{if(e.key==='Escape')this.hide();else if(!this.toolbar?.contains(e.target))schedule();});
  this.registerDomEvent(doc,'pointerdown',e=>{
   if(this.toolbar?.contains(e.target))return;
   const mark=e.target.closest?.('[data-aih-id]');this.tapMark=mark?{id:mark.dataset.aihId,rect:mark.getBoundingClientRect(),x:e.clientX,y:e.clientY}:null;this.hide();
  },true);
  this.registerDomEvent(doc,'click',e=>this.openClickedMark(e),true);
  this.registerDomEvent(doc,'scroll',e=>{if(this.toolbar&&!this.toolbar.contains(e.target))this.hide();},true);
  this.registerDomEvent(doc.defaultView,'resize',()=>this.position());
  if(doc.defaultView.visualViewport){this.registerDomEvent(doc.defaultView.visualViewport,'resize',()=>this.position());this.registerDomEvent(doc.defaultView.visualViewport,'scroll',()=>this.position());}
  this.registerEvent(this.app.workspace.on('file-open',()=>{this.hide();this.renderPanels();this.scheduleLiveCallouts();}));
  this.registerEvent(this.app.vault.on('rename',(file,old)=>{for(const r of this.records){if(r.path===old||r.path.startsWith(old+'/'))r.path=file.path+r.path.slice(old.length);}this.scheduleSave();this.renderPanels();}));
  // Keep annotations for deleted files, so a vault restore can recover them.
  this.registerEvent(this.app.vault.on('delete',()=>this.renderPanels()));
  this.registerEvent(this.app.vault.on('modify',file=>{if(file.extension==='md')void this.reconcile(file);}));
  this.register(()=>{clearTimeout(this.selectionTimer);clearTimeout(this.saveTimer);clearTimeout(this.panelTimer);clearTimeout(this.liveTimer);this.hide();for(const s of this.sections)this.unwrap(s.el);for(const el of this.liveSections.keys())if(el.isConnected)this.unwrap(el);this.liveSections.clear();});
  if(original.schema!==2)await this.persist();
 }
 notice(message){const notice=new Notice(message);(notice.containerEl||notice.noticeEl?.closest?.('.notice'))?.addClass('aih-notice');return notice;}
 t(key){const language=locale(this.settings.language==='auto'?(getLanguage?.()||this.doc?.documentElement.lang||'en'):this.settings.language);return (language==='zh'?words[key]?.[1]:TRANSLATIONS[language]?.[key])||words[key]?.[0]||key;}
 name(c){return this.t('mark')==='劃線'?c.zh:c.en;}
 displayText(r){return r.display||projectMarkdown(r.quote).text;}
 colorHex(r){return slotHex(r,this.settings);}
 markStyle(r){const hex=this.colorHex(r);return `--aih-color:${hex};--aih-tint:${rgba(hex,this.settings.opacity)};--aih-width:${this.settings.width}px;--aih-height:${this.settings.height}px` ;}
 scheduleSave(){clearTimeout(this.saveTimer);this.saveTimer=setTimeout(()=>void this.persist(),250);}
 persist(){const data=JSON.parse(JSON.stringify({schema:2,settings:this.settings,records:this.records}));this.saveChain=this.saveChain.catch(()=>{}).then(()=>this.saveData(data)).catch(e=>{console.error('Easy Text Highlighter: save failed',e);this.notice(this.t('failed'));});return this.saveChain;}
 async onunload(){this.unloading=true;for(const dialog of this.dialogs)dialog.close();clearTimeout(this.saveTimer);await this.persist();}
 schedulePanels(){clearTimeout(this.panelTimer);this.panelTimer=setTimeout(()=>this.renderPanels(),160);}
 renderPanels(){for(const leaf of this.app.workspace.getLeavesOfType(TYPE))leaf.view.render();}
 async openPanel(){let leaf=this.app.workspace.getLeavesOfType(TYPE)[0]||this.app.workspace.getRightLeaf(false);if(!leaf)return;await leaf.setViewState({type:TYPE,active:true});await this.app.workspace.revealLeaf(leaf);this.renderPanels();}
 openClickedMark(e){
  if(this.toolbar?.contains(e.target))return;
  const tap=this.tapMark;this.tapMark=null;
  if(this.doc.getSelection()?.toString().trim()||(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6))return;
  const mark=e.target.closest?.('[data-aih-id]');
  const clicked=mark?{id:mark.dataset.aihId,rect:mark.getBoundingClientRect()}:tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6?tap:null;
  const record=clicked&&this.records.find(r=>r.id===clicked.id);if(!record)return;
  clearTimeout(this.selectionTimer);this.selectionToken++;this.pending={...record};this.rect=clicked.rect;this.show(record,true,true);
 }
 commitRecords(next){
  const before=this.records.map(r=>({...r})),after=next.map(r=>({...r}));
  const ids=new Set([...before,...after].map(r=>r.id));const changed=[...ids].filter(id=>JSON.stringify(before.find(r=>r.id===id))!==JSON.stringify(after.find(r=>r.id===id)));
  if(!changed.length)return;this.undoStack.push({before:before.filter(r=>changed.includes(r.id)),after:after.filter(r=>changed.includes(r.id)),ids:changed});if(this.undoStack.length>100)this.undoStack.shift();this.redoStack=[];this.undoArmed=true;this.records=next;
 }
 handleHistoryKey(e){
  if(e.isComposing||e.altKey)return false;
  const key=e.key.toLowerCase(),shortcut=(e.metaKey||e.ctrlKey)&&!e.repeat;
  if(shortcut&&['v','x'].includes(key)){this.undoArmed=false;return false;}
  if(!shortcut||!['z','y'].includes(key)){if(!e.metaKey&&!e.ctrlKey&&(key.length===1||['backspace','delete','enter'].includes(key)))this.undoArmed=false;return false;}
  if(!this.undoArmed||e.target?.closest?.('input,textarea,select,.modal-container,.workspace-leaf-content[data-type="easy-text-highlights"]'))return false;
  const redo=key==='y'||e.shiftKey,from=redo?this.redoStack:this.undoStack,to=redo?this.undoStack:this.redoStack;
  const action=from.pop();if(!action)return false;
  e.preventDefault();e.stopImmediatePropagation();this.records=this.records.filter(r=>!action.ids.includes(r.id)).concat((redo?action.after:action.before).map(r=>({...r})));to.push(action);this.hide();this.scheduleSave();this.redraw();return true;
 }
 currentView(){return this.app.workspace.getActiveViewOfType(MarkdownView)||this.app.workspace.getMostRecentLeaf()?.view;}
 async reconcile(file){
  const text=await this.app.vault.cachedRead(file);let changed=false;
  for(const r of this.records.filter(r=>r.path===file.path)){const p=resolve(r,text);if(p&&(p.from!==r.from||p.to!==r.to)){Object.assign(r,anchor(text,p.from,p.to));changed=true;}}
  if(changed)this.scheduleSave();this.redraw(false);
 }
 scheduleLiveCallouts(){clearTimeout(this.liveTimer);this.liveTimer=setTimeout(()=>{if(!this.unloading)void this.renderLiveCallouts();},60);}
 async renderLiveCallouts(){
  for(const [el] of this.liveSections)if(!el.isConnected)this.liveSections.delete(el);
  for(const leaf of this.app.workspace.getLeavesOfType('markdown')){
   const view=leaf.view;if(!(view instanceof MarkdownView)||view.getMode()!=='source'||!view.file)continue;
   const source=view.editor.getValue();
   for(const el of view.contentEl.querySelectorAll('.callout')){
    if(el.parentElement?.closest('.callout'))continue;
    let entry=this.liveSections.get(el);if(!entry){entry={el,ctx:{sourcePath:view.file.path,getSectionInfo:()=>({lineStart:0,lineEnd:source.split('\n').length-1})}};this.liveSections.set(el,entry);}
    const stamp=this.revision+'\n'+source;if(entry.stamp===stamp)continue;entry.stamp=stamp;entry.ctx.sourcePath=view.file.path;entry.ctx.getSectionInfo=()=>({lineStart:0,lineEnd:source.split('\n').length-1});
    await this.renderSection(entry,source);
   }
  }
 }
 unwrap(el){for(const m of el.querySelectorAll('span[data-aih-id]'))m.replaceWith(...m.childNodes);el.normalize();}
 async renderSection(entry,liveSource){
  const {el,ctx}=entry;
  if(liveSource===undefined&&el.closest?.('.markdown-source-view')&&(el.closest?.('.callout')||el.querySelector?.('.callout'))){this.scheduleLiveCallouts();return;}
  const revision=(entry.revision||0)+1;entry.revision=revision;const info=ctx.getSectionInfo(el);if(!info)return;
  const file=this.app.vault.getAbstractFileByPath(ctx.sourcePath);if(!file)return;
  const source=liveSource===undefined?await this.app.vault.cachedRead(file):liveSource;if(this.unloading||entry.revision!==revision)return;
  this.unwrap(el);
  const lines=source.split('\n');const start=lines.slice(0,info.lineStart).join('\n').length+(info.lineStart?1:0);const end=start+lines.slice(info.lineStart,info.lineEnd+1).join('\n').length;
  const doc=el.ownerDocument;const walker=doc.createTreeWalker(el,4);const nodes=[];let text='',n;
  while((n=walker.nextNode())){if(n.parentElement.closest('button,script,style,.copy-code-button,.collapse-indicator,.metadata-container'))continue;nodes.push({node:n,start:text.length,end:text.length+n.textContent.length});text+=n.textContent;}
  const mapping=visibleMap(source.slice(start,end),text,start);if(!mapping)return;
  const ranges=[];
  for(const r of this.records.filter(r=>r.path===ctx.sourcePath)){
   const p=resolve(r,source);if(!p||p.to<=start||p.from>=end)continue;
   let first=-1,last=-1;
   for(let i=0;i<mapping.length;i++){const m=mapping[i];if(m&&m.from<p.to&&m.to>p.from){if(first<0)first=i;last=i+1;}}
   if(first>=0)ranges.push({from:first,to:last,r});
  }
  for(const {node,start:ns,end:ne} of nodes.reverse()){
   const parts=segments(ranges).filter(x=>x.from<ne&&x.to>ns).sort((a,b)=>b.from-a.from);
   for(const part of parts){const from=Math.max(0,part.from-ns),to=Math.min(ne-ns,part.to-ns);if(to<node.length)node.splitText(to);const selected=from?node.splitText(from):node;const span=doc.createElement('span');span.className=`aih-mark aih-${part.r.style}`;span.dataset.aihId=part.r.id;span.setAttribute('style',this.markStyle(part.r));selected.replaceWith(span);span.append(selected);}
  }
 }
 redraw(editors=true){if(this.unloading)return;this.revision++;this.scheduleLiveCallouts();if(editors)for(const view of this.editors){try{view.dispatch({effects:refresh.of(this.revision)});}catch(e){console.warn('Highlighter refresh',e);}}for(const s of this.sections)if(s.el.isConnected)void this.renderSection(s);this.renderPanels();if(this.toolbar){const r=this.records.find(x=>x.id===this.toolbar.dataset.highlightId);this.toolbar.style.setProperty('--aih-choice',this.colorHex(r||{color:this.settings.color}));for(const sw of this.toolbar.querySelectorAll('[data-aih-slot]'))sw.style.setProperty('--aih-swatch',this.settings.colors[sw.dataset.aihSlot]);}}

 async capture(){
  const token=++this.selectionToken;if(this.toolbar?.contains(this.doc.activeElement))return;
  let view=this.currentView();
  const sel=this.doc.getSelection();if(!sel||sel.isCollapsed||!sel.toString().trim())return this.hide();
  const range=sel.getRangeAt(0);
  if(!(view instanceof MarkdownView)||!view.contentEl.contains(range.commonAncestorContainer))view=this.app.workspace.getLeavesOfType('markdown').map(l=>l.view).find(v=>v instanceof MarkdownView&&v.contentEl.contains(range.commonAncestorContainer));
  if(!view?.file)return this.hide();
  const selectedElement=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement;const callout=selectedElement?.closest?.('.callout');
  let pending,source;
  if(view.getMode()==='source'&&!callout){
   const ed=view.editor;if(ed.listSelections().length!==1)return this.hide();source=ed.getValue();
   const candidates=[];const cm=[...this.editors].find(editor=>editor.dom?.contains(range.commonAncestorContainer));
   if(cm){try{const a=cm.posAtDOM(range.startContainer,range.startOffset),b=cm.posAtDOM(range.endContainer,range.endOffset);candidates.push({from:Math.min(a,b),to:Math.max(a,b)});}catch{/* A replaced Live Preview node may no longer belong to the editor. */}}
   candidates.push({from:ed.posToOffset(ed.getCursor('from')),to:ed.posToOffset(ed.getCursor('to'))});
   const bounds=editorSelectionBounds(source,sel.toString(),candidates);if(!bounds)return this.hide();pending={path:view.file.path,...anchor(source,bounds.from,bounds.to)};
  }else{
   const text=view.getMode()==='source'?view.editor.getValue():await this.app.vault.cachedRead(view.file);source=text;let selectionFrom=Infinity,selectionTo=-Infinity;
   const entries=[...this.sections];if(callout&&view.contentEl.contains(callout))entries.push({el:callout,ctx:{sourcePath:view.file.path,getSectionInfo:()=>({lineStart:0,lineEnd:text.split('\n').length-1})}});
   for(const entry of entries){
    if(entry.ctx.sourcePath!==view.file.path||!view.contentEl.contains(entry.el)||!range.intersectsNode(entry.el))continue;
    const info=entry.ctx.getSectionInfo(entry.el);if(!info)continue;
    const lines=text.split('\n');const start=lines.slice(0,info.lineStart).join('\n').length+(info.lineStart?1:0),end=start+lines.slice(info.lineStart,info.lineEnd+1).join('\n').length;
    const walker=this.doc.createTreeWalker(entry.el,4),nodes=[];let visible='',node;
    while((node=walker.nextNode())){if(node.parentElement.closest('button,script,style,.copy-code-button,.collapse-indicator,.metadata-container'))continue;nodes.push({node,start:visible.length});visible+=node.textContent;}
    const mapping=visibleMap(text.slice(start,end),visible,start);if(!mapping)continue;
    for(const item of nodes){if(!range.intersectsNode(item.node))continue;const from=range.startContainer===item.node?range.startOffset:0,to=range.endContainer===item.node?range.endOffset:item.node.length;
     for(let i=from;i<to;i++){const m=mapping[item.start+i];if(m){selectionFrom=Math.min(selectionFrom,m.from);selectionTo=Math.max(selectionTo,m.to);}}
    }
   }
   if(!Number.isFinite(selectionFrom))return this.hide();
   const from=selectionFrom,to=selectionTo;
   pending={path:view.file.path,...anchor(text,from,to),display:sel.toString()};
  }
  if(token!==this.selectionToken)return;this.pending=pending;this.rect=range.getBoundingClientRect();const existing=selectedMark(this.records,pending,source);const bounds=existing&&resolve(existing,source);this.show(existing,false,!!bounds&&pending.from>=bounds.from&&pending.to<=bounds.to);
 }
 hide(){this.selectionToken++;this.toolbar?.remove();this.toolbar=null;this.pending=null;}
 button(parent,text,action,cls=''){const b=parent.createEl('button',{text,cls});b.type='button';b.addEventListener('click',action);return b;}
 show(record,expanded,canRemove=true){
  this.toolbar?.remove();const root=this.doc.body.createDiv({cls:'aih-float'});this.toolbar=root;root.setAttribute('role','dialog');root.setAttribute('aria-label',this.t('title'));
  root.dataset.highlightId=record?.id||'';
  root.style.setProperty('--aih-choice',this.colorHex(record||{color:this.settings.color}));
  root.addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault();});
  const bar=root.createDiv({cls:'aih-toolbar'});bar.setAttribute('role','toolbar');
  for(const kind of ['copy','wave','underline','highlight']){
   const action=kind==='copy'?async()=>{try{await navigator.clipboard.writeText(this.displayText(this.pending));this.notice(this.t('copied'));}catch{this.notice(this.t('copyFailed'));}}:()=>{
    // Only a selection fully inside this annotation deletes it; extensions apply/merge.
    if(canRemove&&record&&record.style===kind){this.commitRecords(this.records.filter(r=>r.id!==record.id));this.scheduleSave();this.redraw();this.show(null,false);}
    else void this.apply({style:kind});
   };
   const b=this.button(bar,'',action,'aih-tool');const removing=canRemove&&record?.style===kind;icon(b,kind,removing);b.dataset.kind=kind;b.dataset.action=removing?'remove':kind;b.setAttribute('aria-label',this.t(removing?'remove':kind));
   if(kind!=='copy')b.setAttribute('aria-pressed',String(canRemove&&record?.style===kind));
  }
  if(record){
   const palette=root.createDiv({cls:'aih-colorbar'});palette.setAttribute('role','group');palette.setAttribute('aria-label',this.t('palette'));
   for(let i=0;i<PALETTE.length;i++){
    const c=PALETTE[i],id=c.id;const b=this.button(palette,record.color===id?'✓':'',()=>void this.apply({color:id,style:record.style}),'aih-swatch');
    b.dataset.aihSlot=id;b.style.setProperty('--aih-swatch',this.settings.colors[id]);const label=this.t('slot')+' '+(i+1)+' · '+this.settings.colors[id];b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',String(record.color===id));
   }
  }
  this.position();
 }
 position(){
  if(!this.toolbar||!this.rect)return;
  const win=this.doc.defaultView,v=win.visualViewport;const vp={left:v?.offsetLeft||0,top:v?.offsetTop||0,width:v?.width||win.innerWidth,height:v?.height||win.innerHeight};
  this.toolbar.style.maxWidth=Math.max(0,vp.width-16)+'px';this.toolbar.style.maxHeight=Math.max(0,vp.height-16)+'px';
  const bar=this.toolbar.querySelector('.aih-toolbar'),palette=this.toolbar.querySelector('.aih-colorbar');
  if(palette)this.toolbar.style.setProperty('--aih-toolbar-width',bar.getBoundingClientRect().width+'px');
  this.toolbar.dataset.paletteSide=palette?paletteSide(this.rect,bar.getBoundingClientRect(),palette.getBoundingClientRect(),vp):'above';
  const p=place(this.rect,this.toolbar.getBoundingClientRect(),vp);Object.assign(this.toolbar.style,{left:p.left+'px',top:p.top+'px'});
 }

 async apply(change={}){
  if(!this.pending)return;const pending={...this.pending};const file=this.app.vault.getAbstractFileByPath(pending.path);if(!file)return;
  const view=this.currentView();const text=view instanceof MarkdownView&&view.file?.path===pending.path&&view.getMode()==='source'?view.editor.getValue():await this.app.vault.cachedRead(file);
  const p=resolve(pending,text);if(!p){this.notice(this.t('missing'));return this.hide();}
  const result=upsert(this.records,{...pending,...p},text,change,{color:this.settings.color,style:this.settings.style},this.doc.defaultView.crypto.randomUUID());
  const record=result.record;
  this.commitRecords(result.records);
  if(change.color)this.settings.color=change.color;if(change.style)this.settings.style=change.style;
  this.pending={...record};this.scheduleSave();this.redraw();this.show(record,true);
 }
 async jump(r){
  const navigation=this.navigationToken=(this.navigationToken||0)+1;
  clearTimeout(this.selectionTimer);this.tapMark=null;this.hide();this.doc.getSelection?.()?.removeAllRanges();
  const file=this.app.vault.getAbstractFileByPath(r.path);if(!file){this.notice(this.t('missing'));return;}
  const text=await this.app.vault.cachedRead(file),p=resolve(r,text);if(!p){this.notice(this.t('missing'));return;}
  const leaf=this.app.workspace.getLeaf(false);await leaf.openFile(file,{active:true});const view=leaf.view;
  const line=text.slice(0,p.from).split('\n').length-1;
  if(view instanceof MarkdownView){
   if(view.getMode()==='source'){const from=view.editor.offsetToPos(p.from),to=view.editor.offsetToPos(p.to);view.editor.setCursor(from);view.editor.scrollIntoView({from,to},true);view.editor.focus();}
   else view.setEphemeralState({line});
   await this.centerJump(view,p,r.id,navigation);
  }
 }
 async centerJump(view,range,id,navigation){
  // Initial line navigation mounts virtualized content. Recenter after layout settles.
  for(let attempt=0;attempt<6;attempt++){
   await new Promise(done=>setTimeout(done,50));
   if(this.unloading||navigation!==this.navigationToken)return;
   const cm=[...this.editors].find(editor=>view.contentEl.contains?.(editor.dom));
   const scroller=view.getMode()==='source'?cm?.scrollDOM:view.contentEl.querySelector('.markdown-preview-view');
   if(!scroller)continue;
   let top,bottom;
   if(cm&&view.getMode()==='source'){
    const a=cm.coordsAtPos(range.from),b=cm.coordsAtPos(Math.max(range.from,range.to-1));
    if(a&&b){top=a.top;bottom=b.bottom;}
   }
   if(top===undefined){
    const nodes=view.contentEl.querySelectorAll?.('[data-aih-id]')||[];
    const rects=[...nodes].filter(el=>el.dataset.aihId===id).flatMap(el=>[...el.getClientRects()]);
    if(rects.length){top=Math.min(...rects.map(r=>r.top));bottom=Math.max(...rects.map(r=>r.bottom));}
   }
   if(top===undefined)continue;
   const viewport=scroller.getBoundingClientRect();
   scroller.scrollTop+=((top+bottom)/2)-(viewport.top+scroller.clientHeight/2);
  }
 }
 async noteHighlights(filter={},ids){
  const file=this.app.workspace.getActiveFile();if(!file||file.extension!=='md')return null;
  const live=this.app.workspace.getLeavesOfType('markdown').map(l=>l.view).find(v=>v instanceof MarkdownView&&v.file?.path===file.path&&v.getMode()==='source');
  const source=live?live.editor.getValue():await this.app.vault.cachedRead(file);
  const records=this.records.filter(r=>r.path===file.path);return {file,source,records,tree:highlightOutline(source,records.filter(r=>matchesHighlightFilter(r,filter)&&(!ids||ids.includes(r.id))),file.path)};
 }
 async copyHighlights(filter={},ids){
  const model=await this.noteHighlights(filter,ids);if(!model||!model.tree.count)return;
  try{await navigator.clipboard.writeText(outlineMarkdown(model.tree,model.file.basename,r=>this.displayText(r)));this.notice(this.t('copied'));}catch{this.notice(this.t('copyFailed'));}
 }
 async exportSelected(format,filter,ids,path){
  if(!ids.length)return false;const model=await this.noteHighlights(filter,ids);if(!model||model.file.path!==path){this.notice(this.t('noteChanged'));return false;}if(!model.tree.count)return false;
  const content=outlineMarkdown(model.tree,model.file.basename,r=>this.displayText(r));
  try{if(format==='copy'){await navigator.clipboard.writeText(content);this.notice(this.t('copied'));}
   else{const folder=model.file.path.includes('/')?model.file.path.slice(0,model.file.path.lastIndexOf('/')+1):'';let name=folder+model.file.basename+' - Highlights.md',i=2;while(this.app.vault.getAbstractFileByPath(name))name=folder+model.file.basename+' - Highlights '+(i++)+'.md';await this.app.vault.create(name,content);this.notice(this.t('created')+' · '+name);}
   return true;
  }catch(e){console.error('Highlighter export',e);this.notice(this.t('exportFailed'));return false;}
 }

}
class HighlightsView extends ItemView {
 constructor(leaf,plugin){super(leaf);this.plugin=plugin;this.renderToken=0;this.applied={types:[],colors:[]};this.dialog=null;this.exportMode=false;this.selected=new Set();this.exportPath=null;this.exportBusy=false;}
 getViewType(){return TYPE;}getDisplayText(){return this.plugin.t('title');}getIcon(){return 'highlighter';}
 async onOpen(){await this.render();}
 async onClose(){this.renderToken++;this.dialog?.close();}
 openDialog(kind){if(kind==='export')return this.toggleExport();this.dialog?.close();this.dialog=new HighlightsDialog(this,kind);this.dialog.open();}
 async toggleExport(){
  if(this.exportBusy)return;if(this.exportMode){this.exportMode=false;this.selected.clear();await this.render();return;}
  const model=await this.plugin.noteHighlights(this.applied);if(!model)return;this.dialog?.close();this.exportMode=true;this.exportPath=model.file.path;this.selected=new Set(model.records.filter(r=>matchesHighlightFilter(r,this.applied)).map(r=>r.id));await this.render();
 }
 async runExport(format){
  if(this.exportBusy||!this.exportMode||!this.selected.size)return;this.exportBusy=true;const ids=[...this.selected],path=this.exportPath,filter=this.applied;void this.render();
  try{if(await this.plugin.exportSelected(format,filter,ids,path)){this.exportMode=false;this.selected.clear();}}finally{this.exportBusy=false;await this.render();}
 }
 async render(){
  const token=++this.renderToken,p=this.plugin,c=this.contentEl;const model=await p.noteHighlights(this.applied);if(token!==this.renderToken)return;
  c.empty();c.addClass('aih-sidebar');c.createEl('h3',{text:p.t('title')});
  if(!model){this.exportMode=false;this.selected.clear();c.createEl('p',{text:p.t('openNote'),cls:'aih-empty'});return;}
  if(this.exportMode&&this.exportPath!==model.file.path){this.exportMode=false;this.selected.clear();}
  const visible=model.records.filter(r=>matchesHighlightFilter(r,this.applied));const visibleIds=new Set(visible.map(r=>r.id));this.selected=new Set([...this.selected].filter(id=>visibleIds.has(id)));
  c.createEl('div',{text:model.file.basename,cls:'aih-note-name'});
  const top=c.createDiv({cls:'aih-sidebar-actions'});const summary=top.createDiv({cls:'aih-selection-summary'});const count=summary.createSpan({cls:'aih-count'});count.setAttribute('role','status');count.setAttribute('aria-live','polite');
  const actions=top.createDiv({cls:'aih-sidebar-icon-actions'});
  for(const [kind,label] of [['filter',p.t('filter')],['export',p.t(this.exportMode?'cancel':'exportHighlights')]]){const b=p.button(actions,'',()=>this.openDialog(kind),'aih-panel-icon'+(kind==='export'&&this.exportMode?' aih-export-exit mod-warning':''));icon(b,kind==='export'&&this.exportMode?'close':kind);b.setAttribute('aria-label',label);b.disabled=this.exportBusy;}
  if(!model.tree.count)c.createEl('p',{text:p.t(model.records.length?'noMatches':'empty'),cls:'aih-empty'});
  let deselect;
  if(this.exportMode){deselect=p.button(summary,p.t('deselectAll'),()=>{if(this.exportBusy)return;const all=this.selected.size===visible.length;this.selected=all?new Set():new Set(visible.map(r=>r.id));for(const check of list.querySelectorAll('input'))check.checked=!all;update();},'aih-deselect-all');summary.prepend(deselect);}
  const list=c.createDiv({cls:'aih-flat-list'});let copy,markdown;
  const update=()=>{count.textContent=this.exportMode?this.selected.size+' / '+visible.length+' '+p.t('selected'):model.tree.count+' / '+model.records.length+' '+p.t('items');for(const check of list.querySelectorAll('input'))check.disabled=this.exportBusy;if(copy)copy.disabled=markdown.disabled=this.exportBusy||!this.selected.size;if(deselect){deselect.disabled=this.exportBusy||!visible.length;deselect.textContent=p.t(this.selected.size===visible.length?'deselectAll':'selectAll');}};
  this.renderRows(list,model,this.exportMode,(id,checked)=>{if(this.exportBusy)return;if(checked)this.selected.add(id);else this.selected.delete(id);update();});
  if(this.exportMode){const footer=c.createDiv({cls:'aih-export-footer'});for(const [format,label,kind] of [['copy',p.t('copy'),'copy'],['markdown',p.t('markdownFile'),'markdown']]){const b=p.button(footer,'',()=>void this.runExport(format),'aih-export-footer-action');icon(b,kind);b.createSpan({text:label});if(format==='copy')copy=b;else markdown=b;}}update();
  if(this.dialog&&!this.dialog.busy)void this.dialog.refresh();
 }
 styleBadge(parent,r){const p=this.plugin,soft=softStyleBadge(p.colorHex(r));const badge=parent.createSpan({cls:'aih-entry-style'});badge.style.setProperty('--aih-badge',soft.background);badge.style.setProperty('--aih-badge-ink',soft.ink);icon(badge,r.style);}
 renderRows(container,model,selecting,onSelection){
  const p=this.plugin;for(const group of flatHighlightGroups(model.tree)){
   const section=container.createDiv({cls:'aih-flat-group'});if(group.title)section.createEl('div',{text:group.title,cls:'aih-flat-heading'});
   for(const r of group.items){const row=section.createDiv({cls:'aih-entry aih-selectable-row'+(selecting?' aih-export-row':'')});const b=p.button(row,'',selecting?()=>{if(this.exportBusy)return;const check=row.querySelector('input');check.checked=!check.checked;check.dispatchEvent(new Event('change'));}:()=>void p.jump(r),'aih-entry-link aih-style-row');b.setAttribute('aria-label',(selecting?p.t('selectExport'):p.t(r.style))+' · '+p.displayText(r));this.styleBadge(b,r);const text=b.createSpan({cls:'aih-entry-text'});const excerpt=text.createSpan({text:p.displayText(r),cls:'aih-excerpt aih-'+r.style});excerpt.setAttribute('style',p.markStyle(r));
    if(selecting){const check=row.createEl('input',{cls:'aih-export-check'});check.type='checkbox';check.checked=this.selected.has(r.id);check.setAttribute('aria-label',p.t('selectExport')+' '+p.displayText(r));check.addEventListener('change',()=>onSelection(r.id,check.checked));}
   }
  }
 }
}
class HighlightsDialog extends Modal {
 constructor(view,kind){super(view.plugin.app);this.view=view;this.plugin=view.plugin;this.kind=kind;this.draft={types:[...view.applied.types],colors:[...view.applied.colors]};this.selected=new Set();this.path=null;this.token=0;this.busy=false;this.closed=false;this.plugin.dialogs.add(this);}
 onOpen(){
  this.modalEl.addClass('aih-dialog');this.contentEl.addClass('aih-dialog-content');this.containerEl?.addClass('aih-dialog-container');
  const handle=this.modalEl.createDiv({cls:'aih-sheet-handle'});this.modalEl.prepend(handle);handle.setAttribute('aria-label',this.plugin.t('swipeClose'));handle.setAttribute('role','button');handle.tabIndex=0;
  handle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.close();}});
  const sheet=()=>this.modalEl.ownerDocument.defaultView.matchMedia('(max-width:700px), (pointer:coarse)').matches;
  handle.addEventListener('pointerdown',e=>{if(!sheet()||this.busy||e.button>0)return;this.sheetDrag={id:e.pointerId,y:e.clientY,time:Date.now(),distance:0};handle.setPointerCapture?.(e.pointerId);this.modalEl.removeClass('aih-sheet-settling');});
  handle.addEventListener('pointermove',e=>{const drag=this.sheetDrag;if(!drag||e.pointerId!==drag.id)return;drag.distance=Math.max(0,e.clientY-drag.y);this.modalEl.style.setProperty('--aih-sheet-y',drag.distance+'px');if(e.cancelable)e.preventDefault();});
  const finish=(e,cancelled=false)=>{const drag=this.sheetDrag;if(!drag||e.pointerId!==drag.id)return;this.sheetDrag=null;if(!cancelled&&dismissSheet(drag.distance,Date.now()-drag.time,this.modalEl.getBoundingClientRect().height)){const win=this.modalEl.ownerDocument.defaultView;if(win.matchMedia('(prefers-reduced-motion:reduce)').matches){this.close();return;}this.modalEl.addClass('aih-sheet-settling');this.modalEl.style.setProperty('--aih-sheet-y',this.modalEl.getBoundingClientRect().height+'px');this.sheetTimer=setTimeout(()=>this.close(),180);}else{this.modalEl.addClass('aih-sheet-settling');this.modalEl.style.removeProperty('--aih-sheet-y');}};
  handle.addEventListener('pointerup',e=>finish(e));handle.addEventListener('pointercancel',e=>finish(e,true));void this.refresh();
 }
 onClose(){clearTimeout(this.sheetTimer);this.sheetDrag=null;this.closed=true;this.plugin.dialogs.delete(this);this.token++;if(this.view.dialog===this)this.view.dialog=null;this.contentEl.empty();}
 action(parent,label,kind,fn,cls=''){const b=this.plugin.button(parent,'',fn,'aih-dialog-action '+cls);icon(b,kind);b.createSpan({text:label});return b;}
 async refresh(){
  const token=++this.token,p=this.plugin,model=await p.noteHighlights(this.view.applied);if(this.closed||token!==this.token)return;
  if(!model){this.close();return;}if(this.path&&this.path!==model.file.path){this.close();return;}this.path=model.file.path;this.contentEl.empty();
  this.contentEl.createEl('h2',{text:p.t(this.kind==='filter'?'filterTitle':'exportHighlights')});if(this.kind!=='filter')this.contentEl.createEl('p',{text:model.file.basename,cls:'aih-dialog-note'});
  this.renderFilter(model);
 }
 renderFilter(model){
  const p=this.plugin,c=this.contentEl;
  c.createEl('div',{text:p.t('filterTypes'),cls:'aih-filter-label'});const types=c.createDiv({cls:'aih-filter-options'});types.setAttribute('role','group');types.setAttribute('aria-label',p.t('filterTypes'));
  const buttons=[];let preview;const update=()=>{for(const {button,key,id} of buttons)button.setAttribute('aria-pressed',String(this.draft[key].includes(id)));if(preview)preview.textContent=model.records.filter(r=>matchesHighlightFilter(r,this.draft)).length+' '+p.t('matches');};
  const choice=(parent,key,id,label,cls)=>{const b=p.button(parent,'',()=>{this.draft[key]=this.draft[key].includes(id)?this.draft[key].filter(x=>x!==id):[...this.draft[key],id];update();},cls);b.setAttribute('aria-label',label);buttons.push({button:b,key,id});return b;};
  for(const kind of ['highlight','wave','underline'])icon(choice(types,'types',kind,p.t(kind),'aih-filter-type'),kind);
  c.createEl('div',{text:p.t('filterColors'),cls:'aih-filter-label'});const colors=c.createDiv({cls:'aih-filter-options'});colors.setAttribute('role','group');colors.setAttribute('aria-label',p.t('filterColors'));
  for(const color of PALETTE){const b=choice(colors,'colors',color.id,p.settings.colors[color.id],'aih-filter-color');b.style.setProperty('--aih-swatch',p.settings.colors[color.id]);b.style.setProperty('--aih-swatch-ink',badgeInk(p.settings.colors[color.id]));b.createSpan({text:'✓',cls:'aih-filter-check'});}
  preview=c.createEl('p',{cls:'aih-filter-preview'});preview.setAttribute('role','status');preview.setAttribute('aria-live','polite');update();
  const actions=c.createDiv({cls:'aih-dialog-actions aih-filter-dialog-actions'});
  this.action(actions,p.t('reset'),'reset',()=>{this.draft={types:[],colors:[]};this.view.applied={types:[],colors:[]};void this.view.render();});
  this.action(actions,p.t('confirm'),'check',()=>{this.view.applied={types:[...this.draft.types],colors:[...this.draft.colors]};this.close();void this.view.render();},'mod-cta');
 }
}

class HighlightSettings extends PluginSettingTab {
 constructor(app,plugin){super(app,plugin);this.plugin=plugin;}
 display(){const p=this.plugin,c=this.containerEl;c.empty();c.addClass('aih-settings');new Setting(c).setName(p.t('title')).setHeading().settingEl.addClass('aih-settings-heading');c.createEl('p',{text:p.t('saved')});
  const save=()=>{p.scheduleSave();p.redraw();};
  new Setting(c).setName(p.t('language')).addDropdown(d=>d.addOptions(LANGUAGES).setValue(p.settings.language).onChange(v=>{p.settings.language=v;save();this.display();}));
  new Setting(c).setName(p.t('defaultStyle')).addDropdown(d=>d.addOptions(Object.fromEntries(['highlight','underline','wave'].map(k=>[k,p.t(k)]))).setValue(p.settings.style).onChange(v=>{p.settings.style=v;save();}));
  new Setting(c).setName(p.t('defaultColor')).addDropdown(d=>d.addOptions(Object.fromEntries(PALETTE.map((c,i)=>[c.id,p.t('slot')+' '+(i+1)]))).setValue(p.settings.color).onChange(v=>{p.settings.color=v;save();}));
  new Setting(c).setName(p.t('width')).setDesc('1–5 px · '+p.settings.width+' px').addSlider(s=>s.setLimits(1,5,.5).setValue(p.settings.width).setDynamicTooltip().onChange(v=>{p.settings.width=v;save();}));
  new Setting(c).setName(p.t('opacity')).addSlider(s=>s.setLimits(.1,.7,.05).setValue(p.settings.opacity).setDynamicTooltip().onChange(v=>{p.settings.opacity=v;save();}));
  new Setting(c).setName(p.t('height')).setDesc('0–5 px').addSlider(s=>s.setLimits(0,5,.5).setValue(p.settings.height).setDynamicTooltip().onChange(v=>{p.settings.height=v;save();}));
  new Setting(c).setName(p.t('swatches')).setHeading().settingEl.addClass('aih-settings-heading');
  c.createEl('p',{text:p.t('syncColors')});
  for(let i=0;i<5;i++){
   const color=PALETTE[i],id=color.id;
   new Setting(c).setName(p.t('slot')+' '+(i+1))
    .addColorPicker(s=>s.setValue(p.settings.colors[id]).onChange(v=>{p.settings.colors[id]=v;save();}))
    .addExtraButton(b=>b.setIcon('reset').setTooltip(p.t('reset')).onClick(()=>{p.settings.colors[id]=color.hex;save();this.display();}));
  }
 }
}
module.exports=Highlighter;
