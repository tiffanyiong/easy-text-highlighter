const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const {anchor}=require('../core');
function domElement(tag='div',options={}){const node={tag,text:options.text||'',cls:options.cls||'',children:[],events:{},attrs:{},ownerDocument:{createElementNS:()=>domElement('svg')},style:{values:{},setProperty(k,v){this.values[k]=v;},removeProperty(k){delete this.values[k];}},append(el){this.children.push(el);},prepend(el){this.children.unshift(el);},empty(){this.children=[];},addClass(c){this.cls+=' '+c;},removeClass(c){this.cls=this.cls.split(' ').filter(x=>x!==c).join(' ');},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.events[k]=f;},dispatchEvent(e){this.events[e.type]?.(e);},createEl(t,o){const el=domElement(t,o);this.children.push(el);return el;},createDiv(o){return this.createEl('div',o);},createSpan(o){return this.createEl('span',o);},querySelectorAll(selector){return descendants(this).filter(n=>n!==this&&(selector==='input'?n.tag==='input':n.cls.split(' ').includes(selector.slice(1))));},querySelector(selector){return this.querySelectorAll(selector)[0];}};return node;}
function descendants(node){return [node,...node.children.flatMap(descendants)];}
async function pluginWith(record){
 class Plugin {async loadData(){return {records:[record]};}async saveData(data){this.saved=data;}registerView(type,factory){this.panelFactory=factory;}addSettingTab(tab){this.tab=tab;}addRibbonIcon(){}addCommand(){}registerEditorExtension(extension){this.extension=extension;}registerMarkdownPostProcessor(){}registerDomEvent(){}registerEvent(){}register(){}}
 class Control {addOptions(){return this;}setValue(v){this.value=v;return this;}onChange(f){this.change=f;return this;}setLimits(){return this;}setDynamicTooltip(){return this;}setIcon(){return this;}setTooltip(){return this;}onClick(){return this;}}
 class Setting {constructor(c){assert.equal(c.qaContainer,true);this.c=c;this.settingEl=domElement();}setHeading(){return this;}setName(){return this;}setDesc(){return this;}addDropdown(f){f(new Control());return this;}addSlider(f){f(new Control());return this;}addColorPicker(f){const control=new Control();this.c.pickers.push(control);f(control);return this;}addExtraButton(f){f(new Control());return this;}}
 class Base{};class MockModal{constructor(){this.modalEl=domElement();this.contentEl=this.modalEl.createDiv();}open(){this.onOpen();}close(){this.onClose();}};const info={};const context={Event:class{constructor(type){this.type=type;}},module:{exports:{}},console,setTimeout,clearTimeout,navigator:{language:'en',clipboard:{writeText:async text=>{context.clipboardText=text;}}},require:name=>{
  if(name==='obsidian')return {Plugin,ItemView:Base,PluginSettingTab:Base,Setting,Modal:MockModal,MarkdownView:Base,MarkdownRenderChild:Base,Notice:Base,editorInfoField:info};
  if(name==='@codemirror/state')return {StateEffect:{define:()=>({of:x=>x})}};
  if(name==='@codemirror/view')return {ViewPlugin:{fromClass:C=>C},Decoration:{mark:()=>({range:(from,to)=>({from,to})}),set:x=>x}};
  throw Error(name);
 }};
 vm.runInNewContext(fs.readFileSync(require.resolve('../main'),'utf8'),context);
 const P=context.module.exports,p=new P();p.app={workspace:{containerEl:{ownerDocument:{documentElement:{lang:'en'},defaultView:{}}},on:()=>null,getLeavesOfType:()=>[]},vault:{on:()=>null}};await p.onload();p.MockMarkdown=Base;p.copiedText=()=>context.clipboardText;return p;
}
function state(text){return {field:()=>({file:{path:'demo.md'}}),doc:{toString:()=>text,lineAt:pos=>({to:text.indexOf('\n',pos)<0?text.length:text.indexOf('\n',pos)})}};}
function update(instance,old,next){const startState=state(old),newState=state(next);instance.view.state=newState;instance.update({docChanged:true,startState,state:newState,changes:{mapPos:()=>next.length,iterChangedRanges:cb=>cb(0,old.length,0,next.length)},transactions:[]});}
function clean(p){clearTimeout(p.saveTimer);clearTimeout(p.panelTimer);clearTimeout(p.liveTimer);}
test('real editor extension retains both annotations across disk replacement',async()=>{
 const old='Remember this sentence.\nAnother line.',r={id:'test',path:'demo.md',...anchor(old,0,8),style:'highlight',color:'yellow'};const p=await pluginWith(r);const e=new p.extension({state:state(old)});
 const next='Inserted paragraph.\n'+old;update(e,old,next);assert.equal(p.records.length,1);assert.equal(p.records[0].from,next.indexOf('Remember'));assert.equal(p.records[0].quote,'Remember');
 update(e,next,old);assert.equal(p.records.length,1);assert.equal(p.records[0].from,0);assert.equal(e.decorations.length,1);clean(p);
});
test('full deletion retains unresolved data; undo restores its decoration',async()=>{
 const old='Remember this sentence.',r={id:'test',path:'demo.md',...anchor(old,0,8),style:'wave',color:'purple'};const p=await pluginWith(r);const e=new p.extension({state:state(old)});
 update(e,old,'Nothing left.');assert.equal(p.records.length,1);assert.equal(e.decorations.length,0);
 update(e,'Nothing left.',old);assert.equal(p.records.length,1);assert.equal(e.decorations.length,1);clean(p);
});
for(const style of ['highlight','wave','underline'])test('active '+style+' shows delete icon and removes a whole mark from one character',async()=>{
 const text='Remember this sentence.',r={id:'test',path:'demo.md',...anchor(text,0,8),style,color:'yellow'};
 const p=await pluginWith(r);const unrelated={...r,id:'other',path:'other.md'};p.records.push(unrelated);
 function element(){return {ownerDocument:doc,children:[],style:{setProperty(){}},dataset:{},events:{},setAttribute(){},append(el){this.children.push(el);},remove(){},addEventListener(k,f){this.events[k]=f;},createDiv(){const el=element();this.append(el);return el;},createEl(){const el=element();this.append(el);return el;}};}
 const doc={documentElement:{lang:'en'},createElementNS:()=>element()};doc.body=element();p.doc=doc;p.position=()=>{};p.redraw=()=>{};p.scheduleSave=()=>{};
 p.pending={path:'demo.md',...anchor(text,3,4)};
 const target=require('../core').selectedMark(p.records,p.pending,text);assert.equal(target.id,'test');assert.equal(p.pending.quote.length,1);
 p.pending={path:'demo.md',...anchor(text,0,13)};p.show(target,false,false);const extending=p.toolbar.children[0].children.find(b=>b.dataset.kind===style);assert.equal(extending.dataset.action,style);assert.equal(extending.children[0].children.length,2);let applied;const originalApply=p.apply;p.apply=async change=>{applied=change;};extending.events.click();assert.equal(applied.style,style);assert.equal(p.records.length,2);p.apply=originalApply;p.pending={path:'demo.md',...anchor(text,3,4)};
 p.show(target,false);const button=p.toolbar.children[0].children.find(b=>b.dataset.kind===style);assert.equal(button.dataset.action,'remove');assert.equal(button.children.length,1);assert.equal(button.children[0].children.length,3);assert.equal(p.toolbar.children[1].children.length,5);let picked;p.apply=async change=>{picked=change;};p.toolbar.children[1].children[2].events.click();assert.deepEqual(JSON.parse(JSON.stringify(picked)),{color:'slot-1',style});assert.equal(p.records.length,2);button.events.click();
 assert.equal(p.toolbar.children[0].children.find(b=>b.dataset.kind===style).dataset.action,style);
 assert.equal(p.records.length,1);assert.equal(p.records[0].id,'other');
 clean(p);
});

test('actual settings render five pickers and changing one recolors existing records',async()=>{
 const text='Remember this sentence.',r={id:'test',path:'demo.md',...anchor(text,0,8),style:'highlight',color:'blue'};
 const p=await pluginWith(r);p.tab.containerEl={qaContainer:true,pickers:[],addClass(cls){this.cls=cls;},empty(){this.pickers=[];},createEl(){}};p.tab.display();
 assert.equal(p.tab.containerEl.cls,'aih-settings');assert.equal(p.tab.containerEl.pickers.length,5);assert.equal(p.records[0].color,'slot-5');assert.equal(p.colorHex(p.records[0]),'#a9eae2');
 p.tab.containerEl.pickers[0].change('#f6cf64');assert.equal(p.colorHex(p.records[0]),'#f6cf64');assert.equal(p.records[0].id,'test');
 await p.persist();assert.equal(p.saved.settings.colors['slot-5'],'#f6cf64');assert.equal(p.saved.records[0].color,'slot-5');clean(p);
});

for(const modifier of ['metaKey','ctrlKey'])test(modifier+' undoes color, deletion and addition; typing returns undo to editor',async()=>{
 const r={id:'test',path:'demo.md',...anchor('Remember this sentence.',0,8),style:'highlight',color:'slot-5'};const p=await pluginWith(r);p.redraw=()=>{};p.scheduleSave=()=>{};
 const key=(extra={})=>{let blocked=false;const used=p.handleHistoryKey({key:'z',[modifier]:true,target:{closest:()=>null},preventDefault(){blocked=true;},stopImmediatePropagation(){},...extra});return {used,blocked};};
 p.commitRecords(p.records.map(r=>({...r,color:'slot-2'})));assert.equal(key().used,true);assert.equal(p.records[0].color,'slot-5');assert.equal(key({shiftKey:true}).used,true);assert.equal(p.records[0].color,'slot-2');
 p.commitRecords([]);assert.equal(key().used,true);assert.equal(p.records[0].id,'test');
 p.commitRecords([...p.records,{...r,id:'new'}]);assert.equal(key().used,true);assert.equal(p.records.length,1);
 p.handleHistoryKey({key:'a',target:{closest:()=>null}});assert.equal(key().used,false);assert.equal(p.records.length,1);clean(p);
});
for(const mode of ['source','preview'])test('first selection in '+mode+' callout opens toolbar without prior body selection',async()=>{
 const source='> [!note] Hint\n> Fresh callout text.';const p=await pluginWith({id:'test',path:'other.md',...anchor('Other text',0,5),style:'highlight',color:'slot-1'});
 const callout={};const parent={closest:selector=>selector==='.callout'?callout:null};const title={nodeType:3,textContent:'Hint',length:4,parentElement:parent};const text={nodeType:3,textContent:'Fresh callout text.',length:19,parentElement:parent};
 const range={commonAncestorContainer:text,startContainer:text,endContainer:text,startOffset:0,endOffset:5,intersectsNode:node=>node===text||node===callout,getBoundingClientRect:()=>({left:20,top:100,right:70,bottom:120})};
 const selection={isCollapsed:false,toString:()=> 'Fresh',getRangeAt:()=>range};p.doc={getSelection:()=>selection,createTreeWalker:()=>{const nodes=[title,text];return {nextNode:()=>nodes.shift()};}};
 const view=new p.MockMarkdown();view.file={path:'demo.md'};view.contentEl={contains:()=>true};view.getMode=()=>mode;view.editor={getValue:()=>source,listSelections(){throw Error('Callout must not read stale editor selection');}};
 p.currentView=()=>view;p.app.vault.cachedRead=async()=>source;p.sections=new Set();let shown=false;p.show=()=>{shown=true;};await p.capture();assert.equal(shown,true);assert.equal(p.pending.quote,'Fresh');assert.equal(p.pending.from,source.indexOf('Fresh'));
 let removable;p.show=(_record,_expanded,canRemove)=>{removable=canRemove;};
 p.records=[{id:'short',path:'demo.md',...anchor(source,source.indexOf('Fresh'),source.indexOf('Fresh')+3),style:'highlight',color:'slot-2'}];await p.capture();assert.equal(removable,false);
 p.records=[{id:'long',path:'demo.md',...anchor(source,source.indexOf('Fresh'),source.indexOf('Fresh')+18),style:'highlight',color:'slot-2'}];await p.capture();assert.equal(removable,true);clean(p);
});
test('undo restores overlapping records replaced by a single recolored annotation',async()=>{
 const text='without touching normal';const first={id:'yellow',path:'demo.md',...anchor(text,0,text.length),style:'highlight',color:'slot-2'},nested={id:'pink',path:'demo.md',...anchor(text,8,16),style:'highlight',color:'slot-3'};
 const p=await pluginWith(first);p.records.push(nested);p.redraw=()=>{};p.scheduleSave=()=>{};
 const next=require('../core').upsert(p.records,{path:'demo.md',...anchor(text,8,16)},text,{color:'slot-5'},{style:'highlight',color:'slot-2'},'new');p.commitRecords(next.records);assert.equal(p.records.length,1);assert.equal(p.records[0].quote,text);
 assert.equal(p.handleHistoryKey({key:'z',metaKey:true,target:{closest:()=>null},preventDefault(){},stopImmediatePropagation(){}}),true);assert.equal(p.records.length,2);assert.equal(p.records.find(r=>r.id==='pink').color,'slot-3');clean(p);
});

for(const style of ['highlight','wave','underline'])test('single click on '+style+' opens deletion toolbar without selecting; dragging stays selection',async()=>{
 const record={id:'tap',path:'demo.md',...anchor('without touching normal',0,16),style,color:'slot-2'};const p=await pluginWith(record);let selected='',shown;
 p.doc={getSelection:()=>({toString:()=>selected})};p.show=(r,expanded,canRemove)=>{shown={r,expanded,canRemove};};
 const mark={dataset:{aihId:'tap'},getBoundingClientRect:()=>({left:20,top:30})};p.openClickedMark({target:{closest:()=>mark}});assert.equal(shown.r.id,'tap');assert.equal(shown.expanded,true);assert.equal(shown.canRemove,true);assert.equal(p.pending.quote,'without touching');
 shown=null;selected='without touching normal';p.openClickedMark({target:{closest:()=>mark}});assert.equal(shown,null);
 selected='';p.tapMark={id:'tap',rect:{left:20,top:30},x:20,y:30};p.openClickedMark({target:{closest:()=>null},clientX:21,clientY:30});assert.equal(shown.r.id,'tap');
 shown=null;p.tapMark={id:'tap',rect:{left:20,top:30},x:20,y:30};p.openClickedMark({target:{closest:()=>null},clientX:100,clientY:30});assert.equal(shown,null);clean(p);
});

test('Live Preview callout widgets paint persisted marks without activating the text editor',async()=>{
 const text='> [!note] Test\n> without touching normal';const r={id:'widget',path:'demo.md',...anchor(text,text.indexOf('without'),text.length),style:'highlight',color:'slot-2'};const p=await pluginWith(r);
 const el={isConnected:true,parentElement:{closest:()=>null}};const view=new p.MockMarkdown();view.file={path:'demo.md'};view.getMode=()=> 'source';view.editor={getValue:()=>text};view.contentEl={querySelectorAll:()=>[el]};p.app.workspace.getLeavesOfType=()=>[{view}];let painted=[];p.renderSection=async(entry,source)=>painted.push({entry,source});
 await p.renderLiveCallouts();assert.equal(painted.length,1);assert.equal(painted[0].entry.el,el);assert.equal(painted[0].source,text);await p.renderLiveCallouts();assert.equal(painted.length,1);p.revision++;await p.renderLiveCallouts();assert.equal(painted.length,2);clean(p);
});

test('flat sidebar has icon-only actions and centered filter/export dialog flows',async()=>{
 const text='# Parent\n## Section\nwithout touching normal';const r={id:'panel',path:'demo.md',...anchor(text,text.indexOf('without'),text.length),color:'slot-2',style:'highlight'};const p=await pluginWith(r);p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'My note',extension:'md'});p.app.vault.cachedRead=async()=>text;
 const panel=p.panelFactory({});panel.contentEl=domElement();await panel.render();let nodes=descendants(panel.contentEl);assert.ok(nodes.some(n=>n.text==='My note'));assert.equal(nodes.filter(n=>n.tag==='details').length,0);assert.deepEqual(nodes.filter(n=>n.cls==='aih-flat-heading').map(n=>n.text),['Section']);assert.equal(nodes.filter(n=>n.cls==='aih-panel-icon').length,2);assert.ok(!nodes.some(n=>n.text==='Export highlights'));
 panel.openDialog('filter');let dialog=panel.dialog;await dialog.refresh();assert.deepEqual(descendants(dialog.contentEl).filter(n=>n.cls.split(' ').includes('aih-dialog-action')).map(n=>n.children.find(c=>c.tag==='span')?.text),['Reset','Confirm']);assert.ok(!descendants(dialog.contentEl).some(n=>n.cls.includes('mod-warning')));let controls=descendants(dialog.contentEl);assert.ok(controls.some(n=>n.text==='Filter your highlights'));assert.ok(!controls.some(n=>n.cls==='aih-dialog-note'||n.text==='No selection means all.'));assert.equal(controls.filter(n=>n.cls==='aih-filter-check').length,5);controls.filter(n=>n.cls==='aih-filter-type')[1].events.click();assert.equal(dialog.draft.types[0],'wave');assert.equal(panel.applied.types.length,0);assert.equal(controls.find(n=>n.cls==='aih-filter-preview').textContent,'0 matching highlights');controls.find(n=>n.cls.includes('mod-cta')).events.click();await panel.render();assert.equal(descendants(panel.contentEl).filter(n=>n.cls.includes('aih-entry-link')).length,0);
 panel.openDialog('filter');dialog=panel.dialog;await dialog.refresh();descendants(dialog.contentEl).find(n=>n.cls.includes('aih-dialog-action')&&n.children.some(c=>c.text==='Reset')).events.click();await panel.render();assert.equal(dialog.closed,false);assert.equal(panel.dialog,dialog);assert.equal(dialog.draft.types.length,0);assert.equal(descendants(panel.contentEl).filter(n=>n.cls.includes('aih-entry-link')).length,1);
 await panel.openDialog('export');assert.equal(panel.dialog,null);assert.equal(panel.exportMode,true);controls=descendants(panel.contentEl);let check=controls.find(n=>n.cls==='aih-export-check');assert.equal(check.checked,true);assert.equal(panel.selected.size,1);assert.equal(controls.filter(n=>n.cls==='aih-export-footer-action').length,2);
 const selectingRow=controls.find(n=>n.cls.includes('aih-entry-link'));selectingRow.events.click();assert.equal(panel.selected.size,0);assert.equal(check.checked,false);selectingRow.events.click();assert.equal(panel.selected.size,1);assert.equal(check.checked,true);
 await controls.find(n=>n.cls.includes('aih-export-exit')).events.click();controls=descendants(panel.contentEl);assert.equal(panel.exportMode,false);assert.equal(controls.filter(n=>n.cls==='aih-export-check'||n.cls==='aih-export-footer').length,0);let jumped;p.jump=async r=>{jumped=r.id;};controls.find(n=>n.cls.includes('aih-entry-link')).events.click();assert.equal(jumped,'panel');
 p.app.workspace.getActiveFile=()=>({path:'other.md',basename:'Other',extension:'md'});await panel.render();assert.equal(descendants(panel.contentEl).filter(n=>n.cls.includes('aih-entry-link')).length,0);clean(p);
});
test('Copy highlights copies only active-note excerpts with headings and creates no notes',async()=>{
 const text='# Topic\nOne excerpt';const p=await pluginWith({id:'copy',path:'demo.md',...anchor(text,text.indexOf('One'),text.length),style:'highlight',color:'slot-2'});p.records.push({id:'foreign',path:'other.md',...anchor('Secret other excerpt',0,20),style:'highlight',color:'slot-1'});
 p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'Demo',extension:'md'});p.app.vault.cachedRead=async()=>text;p.app.vault.create=()=>{throw Error('Copy must not create files');};await p.copyHighlights();assert.equal(p.copiedText(),'# Demo\n\n## Topic\n\n> One excerpt\n');assert.ok(!p.copiedText().includes('Secret'));clean(p);
});

test('selected export respects both current filters and checked IDs, preserves source and avoids file overwrite',async()=>{
 const text='# Topic\nFirst excerpt\nSecond excerpt';const rec=(q,id,style)=>({id,path:'Folder/demo.md',...anchor(text,text.indexOf(q),text.indexOf(q)+q.length),style,color:'slot-2'});const p=await pluginWith(rec('First excerpt','one','highlight'));p.records.push(rec('Second excerpt','two','wave'));p.app.workspace.getActiveFile=()=>({path:'Folder/demo.md',basename:'demo',extension:'md'});p.app.vault.cachedRead=async()=>text;
 await p.exportSelected('copy',{},['two'],'Folder/demo.md');assert.ok(p.copiedText().includes('Second excerpt'));assert.ok(!p.copiedText().includes('First excerpt'));
 const created=[];p.app.vault.getAbstractFileByPath=path=>path==='Folder/demo - Highlights.md';p.app.vault.create=async(path,body)=>{created.push({path,body});};
 assert.equal(await p.exportSelected('markdown',{types:['wave']},['one','two'],'Folder/demo.md'),true);assert.equal(created.length,1);assert.equal(created[0].path,'Folder/demo - Highlights 2.md');assert.ok(created[0].body.includes('Second excerpt'));assert.ok(!created[0].body.includes('First excerpt'));assert.equal(p.records.length,2);
 assert.equal(await p.exportSelected('markdown',{},[],'Folder/demo.md'),false);assert.equal(await p.exportSelected('markdown',{},['one'],'different.md'),false);assert.equal(created.length,1);clean(p);
});
test('mobile sheet grip snaps back on a cancelled drag and closes on a deliberate downward drag',async()=>{
 const p=await pluginWith({id:'sheet',path:'demo.md',...anchor('text',0,4),style:'highlight',color:'slot-2'});p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'Demo',extension:'md'});p.app.vault.cachedRead=async()=> 'text';const panel=p.panelFactory({});panel.contentEl=domElement();panel.openDialog('filter');const dialog=panel.dialog;await dialog.refresh();dialog.modalEl.ownerDocument.defaultView={matchMedia:()=>({matches:true})};dialog.modalEl.getBoundingClientRect=()=>({height:600});const grip=descendants(dialog.modalEl).find(n=>n.cls==='aih-sheet-handle');
 grip.events.pointerdown({pointerId:1,clientY:10,button:0});grip.events.pointermove({pointerId:1,clientY:170});assert.equal(dialog.modalEl.style.values['--aih-sheet-y'],'160px');grip.events.pointercancel({pointerId:1});assert.equal(dialog.closed,false);assert.equal(dialog.modalEl.style.values['--aih-sheet-y'],undefined);
 grip.events.pointerdown({pointerId:2,clientY:10,button:0});grip.events.pointermove({pointerId:2,clientY:170});grip.events.pointerup({pointerId:2});assert.equal(dialog.closed,true);assert.equal(panel.dialog,null);clean(p);
});

for(const style of ['highlight','wave','underline'])test('sidebar '+style+' excerpts use the saved color and configured opacity/line width',async()=>{
 const text='Normal body after the callout.';const r={id:'style',path:'demo.md',...anchor(text,0,text.length),style,color:'slot-3'};const p=await pluginWith(r);p.settings.opacity=.45;p.settings.width=3;p.settings.colors['slot-3']='#e96b79';p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'Demo',extension:'md'});p.app.vault.cachedRead=async()=>text;const panel=p.panelFactory({});panel.contentEl=domElement();await panel.render();let excerpt=descendants(panel.contentEl).find(n=>n.cls==='aih-excerpt aih-'+style);assert.ok(excerpt);assert.equal(excerpt.text,text);assert.equal(excerpt.attrs.style,p.markStyle(p.records[0]));assert.ok(excerpt.attrs.style.includes('--aih-color:#e96b79'));assert.ok(excerpt.attrs.style.includes('--aih-width:3px'));
 p.settings.colors['slot-3']='#000000';await panel.render();excerpt=descendants(panel.contentEl).find(n=>n.cls==='aih-excerpt aih-'+style);assert.ok(excerpt.attrs.style.includes('--aih-color:#000000'));assert.equal(p.records.length,1);clean(p);
});
for(const directDOM of [false,true])test('Editing View captures full Chinese heading despite stale prefix offsets, DOM mapping '+directDOM,async()=>{
 const source='# Note\n\n## 提示框與引用\n\nBody';const start=source.indexOf('##'),end=source.indexOf('\n',start);const p=await pluginWith({id:'other',path:'other.md',...anchor('Other text',0,5),style:'highlight',color:'slot-1'});
 const node={nodeType:3,parentElement:{closest:()=>null}};const range={commonAncestorContainer:node,startContainer:node,endContainer:node,startOffset:0,endOffset:9,getBoundingClientRect:()=>({left:20,right:100,top:80,bottom:100})};p.doc={getSelection:()=>({isCollapsed:false,toString:()=> '## 提示框與引用',getRangeAt:()=>range})};
 const view=new p.MockMarkdown();view.file={path:'demo.md'};view.contentEl={contains:()=>true};view.getMode=()=> 'source';view.editor={getValue:()=>source,listSelections:()=>[{}],getCursor:side=>({side}),posToOffset:pos=>pos.side==='from'?start+4:end};p.currentView=()=>view;
 if(directDOM)p.editors.add({dom:{contains:()=>true},posAtDOM:(_node,offset)=>offset===0?start:end});p.show=()=>{};await p.capture();assert.equal(p.pending.quote,'## 提示框與引用');assert.equal(p.pending.from,start);assert.equal(p.pending.to,end);clean(p);
});
test('sidebar export selects all filtered results, prunes hidden selections and exits after copy',async()=>{
 const text='# Topic\nFirst\nSecond';const r=(q,id,style)=>({id,path:'demo.md',...anchor(text,text.indexOf(q),text.indexOf(q)+q.length),style,color:'slot-2'});const p=await pluginWith(r('First','first','highlight'));p.records.push(r('Second','second','wave'));p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'Demo',extension:'md'});p.app.vault.cachedRead=async()=>text;const panel=p.panelFactory({});panel.contentEl=domElement();await panel.render();await panel.toggleExport();assert.equal(panel.selected.size,2);assert.equal(p.dialogs.size,0);
 panel.applied={types:['wave'],colors:[]};await panel.render();assert.deepEqual([...panel.selected],['second']);assert.equal(descendants(panel.contentEl).filter(n=>n.cls==='aih-export-check').length,1);let exported;p.exportSelected=async(...args)=>{exported=args;return true;};await panel.runExport('copy');assert.equal(exported[0],'copy');assert.deepEqual([...exported[2]],['second']);assert.equal(panel.exportMode,false);assert.equal(descendants(panel.contentEl).filter(n=>n.cls==='aih-export-check').length,0);
 await panel.toggleExport();p.app.workspace.getActiveFile=()=>({path:'other.md',basename:'Other',extension:'md'});await panel.render();assert.equal(panel.exportMode,false);assert.equal(panel.selected.size,0);clean(p);
});

for(const mode of ['source','preview'])test('sidebar navigation in '+mode+' hides toolbar and does not select the excerpt',async()=>{
 const text='Normal body after the callout.',r={id:'jump',path:'demo.md',...anchor(text,0,6),style:'highlight',color:'slot-1'};
 const p=await pluginWith(r);let removed=0,cleared=0,cursor,scrolled,focused=0,ephemeral;
 p.toolbar={remove(){removed++;}};p.pending=r;p.doc.getSelection=()=>({removeAllRanges(){cleared++;}});
 const view=new p.MockMarkdown();view.getMode=()=>mode;view.editor={offsetToPos:ch=>({line:0,ch}),setCursor:pos=>{cursor=pos;},setSelection:()=>assert.fail('navigation must not select text'),scrollIntoView:range=>{scrolled=range;},focus:()=>{focused++;}};
 view.setEphemeralState=state=>{ephemeral=state;};view.contentEl={querySelector:()=>null};
 p.app.vault.getAbstractFileByPath=()=>({path:'demo.md'});p.app.vault.cachedRead=async()=>text;p.app.workspace.getLeaf=()=>({view,openFile:async()=>{}});
 await p.jump(r);assert.equal(removed,1);assert.equal(cleared,1);assert.equal(p.toolbar,null);assert.equal(p.pending,null);
 if(mode==='source'){assert.equal(cursor.ch,0);assert.equal(scrolled.to.ch,6);assert.equal(focused,1);}else assert.equal(ephemeral.line,0);
 clean(p);
});

for(const modifier of ['ctrlKey','metaKey'])test(modifier+' paste yields undo to the note editor',async()=>{
 const text='Original note',r={id:'paste',path:'demo.md',...anchor(text,0,8),style:'highlight',color:'slot-1'};const p=await pluginWith(r);
 p.commitRecords([{...r,color:'slot-2'}]);assert.equal(p.undoArmed,true);
 assert.equal(p.handleHistoryKey({key:'v',[modifier]:true}),false);
 assert.equal(p.handleHistoryKey({key:'z',[modifier]:true,preventDefault(){assert.fail('native paste undo must not be intercepted');}}),false);
 assert.equal(p.records[0].color,'slot-2');clean(p);
});
test('editor content changes yield subsequent undo to native history',async()=>{
 const text='Original note',r={id:'paste',path:'demo.md',...anchor(text,0,8),style:'highlight',color:'slot-1'};const p=await pluginWith(r);const e=new p.extension({state:state(text)});
 p.commitRecords([{...r,color:'slot-2'}]);update(e,text,text+' pasted text');assert.equal(p.undoArmed,false);clean(p);
});
test('plugin notices carry a scoped class for active-theme styling',async()=>{
 const p=await pluginWith({id:'notice',path:'demo.md',...anchor('Note',0,4),style:'highlight',color:'slot-1'});let added;
 p.MockMarkdown.prototype.noticeEl={addClass:()=>assert.fail('message is not the notice outer frame')};p.MockMarkdown.prototype.containerEl={addClass:cls=>{added=cls;}};
 assert.ok(p.notice('Copied'));assert.equal(added,'aih-notice');delete p.MockMarkdown.prototype.noticeEl;delete p.MockMarkdown.prototype.containerEl;clean(p);
});
for(const mode of ['source','preview'])test(mode+' sidebar target is centered by its complete rendered height',async()=>{
 const p=await pluginWith({id:'center',path:'demo.md',...anchor('Target',0,6),style:'highlight',color:'slot-1'});
 const scroller={scrollTop:0,clientHeight:600,getBoundingClientRect:()=>({top:80})};
 const mark={dataset:{aihId:'center'},getClientRects:()=>[{top:900-scroller.scrollTop,bottom:920-scroller.scrollTop},{top:940-scroller.scrollTop,bottom:960-scroller.scrollTop}]};
 const view={getMode:()=>mode,contentEl:{contains:()=>mode==='source',querySelector:()=>scroller,querySelectorAll:()=>[mark]}};
 if(mode==='source')p.editors.add({dom:{},scrollDOM:scroller,coordsAtPos:pos=>pos===0?{top:900-scroller.scrollTop,bottom:920-scroller.scrollTop}:{top:940-scroller.scrollTop,bottom:960-scroller.scrollTop}});
 p.navigationToken=1;await p.centerJump(view,{from:0,to:6},'center',1);
 assert.equal(scroller.scrollTop,550);assert.equal((900+960)/2-scroller.scrollTop,80+600/2);clean(p);
});
test('stale sidebar navigation does not scroll after a newer jump',async()=>{
 const p=await pluginWith({id:'center',path:'demo.md',...anchor('Target',0,6),style:'highlight',color:'slot-1'});p.navigationToken=2;
 await p.centerJump({contentEl:{contains:()=>assert.fail('stale target must not scroll')}},{from:0,to:6},'center',1);clean(p);
});
test('built plugin uses explicit and automatic locale translations',async()=>{
 const {TRANSLATIONS}=require('../i18n');const p=await pluginWith({id:'lang',path:'demo.md',...anchor('Note',0,4),style:'highlight',color:'slot-1'});
 for(const [code,translation] of Object.entries(TRANSLATIONS)){p.settings.language=code;for(const key of Object.keys(translation))assert.equal(p.t(key),translation[key],code+': '+key);}
 p.settings.language='auto';p.doc.documentElement.lang='zh-CN';assert.equal(p.t('copy'),'复制');p.doc.documentElement.lang='ja-JP';assert.equal(p.t('copy'),'コピー');p.doc.documentElement.lang='fr';assert.equal(p.t('copy'),'Copier');p.doc.documentElement.lang='unknown';assert.equal(p.t('copy'),'Copy');clean(p);
});
test('Deselect All clears export checkboxes and disables empty export actions',async()=>{
 const text='First Second',r={id:'first',path:'demo.md',...anchor(text,0,5),style:'highlight',color:'slot-2'};const p=await pluginWith(r);p.records.push({...r,id:'second',...anchor(text,6,12)});
 p.app.workspace.getActiveFile=()=>({path:'demo.md',basename:'Demo',extension:'md'});p.app.vault.cachedRead=async()=>text;
 const panel=p.panelFactory({});panel.contentEl=domElement();await panel.render();assert.equal(descendants(panel.contentEl).some(n=>n.cls==='aih-deselect-all'),false);
 await panel.toggleExport();const controls=descendants(panel.contentEl),deselect=controls.find(n=>n.cls==='aih-deselect-all');assert.equal(deselect.disabled,false);deselect.events.click();
 assert.equal(panel.selected.size,0);assert.ok(controls.filter(n=>n.cls==='aih-export-check').every(n=>!n.checked));assert.ok(controls.filter(n=>n.cls==='aih-export-footer-action').every(n=>n.disabled));assert.equal(deselect.disabled,false);assert.equal(deselect.textContent,'Select All');deselect.events.click();assert.equal(panel.selected.size,2);deselect.events.click();
 controls.find(n=>n.cls.includes('aih-entry-link')).events.click();assert.equal(panel.selected.size,1);assert.equal(deselect.disabled,false);clean(p);
});
