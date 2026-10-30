/* Pure annotation and viewport logic; shared by plugin and behavior tests. */
const LEGACY_PALETTE = [
 ['green','Green','綠色','#20c933'],['pink','Pink','粉紅','#f7a3b3'],
 ['purple','Purple','紫色','#b77aeb'],['blue','Blue','藍色','#8899ef'],
 ['yellow','Yellow','黃色','#f6cf64'],['orange','Orange','橙色','#e99161'],
 ['mint','Mint','薄荷','#7fd4bc'],['sage','Sage','鼠尾草綠','#8bc88c'],
 ['red','Red','紅色','#ff6d70'],['lime','Lime','萊姆綠','#cbdc4d'],
 ['lemon','Yellow green','黃綠','#ece34b'],['brown','Brown','棕色','#9c865a'],
 ['peach','Peach','蜜桃','#e58b75'],['parchment','Parchment','羊皮紙','#e8dcc0']
].map(([id,en,zh,hex])=>({id,en,zh,hex}));
const PALETTE=[
 ['slot-2','Color 1','顏色 1','#fdf85d'],
 ['slot-5','Color 2','顏色 2','#a9eae2'],
 ['slot-1','Color 3','顏色 3','#91f476'],
 ['slot-3','Color 4','顏色 4','#f7a3b3'],
 ['slot-4','Color 5','顏色 5','#ceaef4']
].map(([id,en,zh,hex])=>({id,en,zh,hex}));
const DEFAULTS={language:'auto',color:PALETTE[0].id,style:'highlight',height:2,width:2,opacity:.3,colors:Object.fromEntries(PALETTE.map(c=>[c.id,c.hex]))};
const validHex=x=>typeof x==='string'&&/^#[\da-f]{6}$/i.test(x);
function settings(raw={}) {
 const n=(x,min,max,d)=>Number.isFinite(x)?Math.max(min,Math.min(max,x)):d;
 const oldQuick=raw.quickColors||['green','lemon','pink','purple','blue'];
 const colors=Object.fromEntries(PALETTE.map((c,i)=>{
  const oldId=oldQuick[Number(c.id.slice(-1))-1],oldDefault=LEGACY_PALETTE.find(x=>x.id===oldId)?.hex,old=raw.colors?.[oldId];
  // Preserve deliberate custom colors; refresh the old factory palette to softer defaults.
  return [c.id,validHex(raw.colors?.[c.id])?raw.colors[c.id]:(validHex(old)&&old!==oldDefault?old:c.hex)];
 }));
 return {language:['auto','en','zh','zh-CN','ja','ko','es','fr','de','pt','it'].includes(raw.language)?raw.language:'auto',color:raw.color==null?DEFAULTS.color:PALETTE.some(c=>c.id===raw.color)?raw.color:legacySlot(raw.color,raw,colors),style:['highlight','underline','wave'].includes(raw.style)?raw.style:'highlight',height:n(raw.height,0,5,2),width:n(raw.width,1,5,2),opacity:n(raw.opacity,.1,.7,.3),colors};
}
function legacySlot(color,raw={},colors=DEFAULTS.colors,hex){
 if(PALETTE.some(c=>c.id===color))return color;
 const quick=raw.quickColors||['green','lemon','pink','purple','blue'];const index=quick.indexOf(color);if(index>=0&&index<5)return 'slot-'+(index+1);
 if(['green','sage','lime','mint'].includes(color))return 'slot-1';
 if(['yellow','lemon','orange'].includes(color))return 'slot-2';
 if(['pink','peach','red'].includes(color))return 'slot-3';
 if(color==='purple')return 'slot-4';if(color==='blue')return 'slot-5';
 const target=hex||raw.colors?.[color]||raw.customColor;if(!validHex(target))return 'slot-2';
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),v=rgb(target);
 return PALETTE.map(c=>({id:c.id,d:rgb(colors[c.id]).reduce((n,x,i)=>n+(x-v[i])**2,0)})).sort((a,b)=>a.d-b.d)[0].id;
}
function migrateData(data={}){
 const next=settings(data.settings);const records=(Array.isArray(data.records)?data.records:[]).map(r=>{
  const migrated={...r,color:legacySlot(r.color,data.settings||{},next.colors,r.hex)};delete migrated.hex;return migrated;
 });return {schema:2,settings:next,records};
}
function slotHex(record,config){return config.colors[record?.color]||config.colors['slot-2'];}
function anchor(text,from,to) {return {from,to,quote:text.slice(from,to),before:text.slice(Math.max(0,from-40),from),after:text.slice(to,to+40)};}
function occurrences(text,quote) {const out=[]; if(!quote)return out; let i=0; while((i=text.indexOf(quote,i))!==-1){out.push(i);i+=quote.length;}return out;}
function resolve(record,text) {
 const hits=occurrences(text,record.quote); if(hits.length===1)return {from:hits[0],to:hits[0]+record.quote.length};
 const contextual=hits.filter(i=>(!record.before||text.slice(Math.max(0,i-record.before.length),i)===record.before)&&(!record.after||text.slice(i+record.quote.length,i+record.quote.length+record.after.length)===record.after));
 return contextual.length===1?{from:contextual[0],to:contextual[0]+record.quote.length}:null;
}
function place(rect,size,vp) {
 const margin=8, gap=10, width=Math.min(size.width,Math.max(0,vp.width-16)),height=Math.min(size.height,Math.max(0,vp.height-16));
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const x=clamp((rect.left+rect.right-width)/2,vp.left+margin,vp.left+vp.width-width-margin);
 const above=rect.top-gap-height;
 const y=above>=vp.top+margin?above:clamp(rect.bottom+gap,vp.top+margin,vp.top+vp.height-height-margin);
 return {left:x,top:y,maxWidth:Math.max(0,vp.width-16),maxHeight:Math.max(0,vp.height-16)};
}
function rgba(hex,alpha){return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${alpha})`;}
module.exports={PALETTE,DEFAULTS,settings,anchor,occurrences,resolve,place,rgba,migrateData,slotHex};

// Full containment replaces covered marks; partial intersections remain independent.
function upsert(records,pending,text,change,defaults,id,now=Date.now()) {
 const p=resolve(pending,text);if(!p)return null;
 const positioned=records.map(r=>({r,p:r.path===pending.path?resolve(r,text):null}));
 let from=p.from,to=p.to;const covered=[];let grew;
 do{grew=false;for(const x of positioned){if(!x.p||covered.includes(x)||x.p.from>=to||x.p.to<=from)continue;covered.push(x);from=Math.min(from,x.p.from);to=Math.max(to,x.p.to);grew=true;}}while(grew);
 const base=covered.slice().sort((a,b)=>(b.r.updated||b.r.created||0)-(a.r.updated||a.r.created||0))[0]?.r;
 const record={...(base||{id,created:now,color:defaults.color,style:defaults.style}),path:pending.path,...anchor(text,from,to),...change,updated:now};
 if(pending.display&&from===p.from&&to===p.to)record.display=pending.display;else delete record.display;
 const removed=new Set(covered.map(x=>x.r.id));
 return {record,records:[...records.filter(r=>!removed.has(r.id)),record]};
}
// Paint each overlap once. Latest mark wins visually, while all partial records survive.
function segments(ranges) {
 const edges=[...new Set(ranges.flatMap(x=>[x.from,x.to]))].sort((a,b)=>a-b),out=[];
 for(let i=0;i<edges.length-1;i++){
  const from=edges[i],to=edges[i+1];const active=ranges.filter(x=>x.from<=from&&x.to>=to);
  if(!active.length)continue;active.sort((a,b)=>(a.r.updated||a.r.created||0)-(b.r.updated||b.r.created||0));const r=active[active.length-1].r;
  if(out.length&&out[out.length-1].r.id===r.id&&out[out.length-1].to===from)out[out.length-1].to=to;else out.push({from,to,r});
 }
 return out;
}
module.exports.upsert=upsert;module.exports.segments=segments;

// A single selected character is sufficient to address the entire visible mark.
function selectedMark(records,pending,text) {
 return records.map((r,index)=>({r,index,p:r.path===pending.path?resolve(r,text):null}))
  .filter(x=>x.p&&x.p.from<pending.to&&x.p.to>pending.from)
  .sort((a,b)=>(b.r.updated||b.r.created||0)-(a.r.updated||a.r.created||0)||b.index-a.index)[0]?.r;
}
module.exports.selectedMark=selectedMark;

// Visible Markdown projection with source offsets; markup stays untouched in notes.
function projectMarkdown(source,options={}) {
 const chars=[],offsets=[];let tableMode=false;const emit=(s,from,to)=>{for(const ch of s){for(let j=0;j<ch.length;j++){chars.push(ch[j]);offsets.push({from,to});}}};
 const references=new Set((options.preserveReferences?[]:(options.referenceSource||source).split('\n')).map(line=>line.replace(/^\s*(?:>\s*)+/, '').match(/^\s{0,3}\[([^\]]+)\]:\s*\S/)?.[1]?.trim().replace(/\s+/g,' ').toLowerCase()).filter(Boolean));
 const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
 function bracketEnd(open,end){let depth=0;for(let k=open;k<end;k++){if(source[k]==='\\'){k++;continue;}if(source[k]==='[')depth++;if(source[k]===']'&&!--depth)return k;}return -1;}
 function inline(start,end){let i=start;
  while(i<end){
   if(source[i]==='\\'&&i+1<end){emit(source[i+1],i,i+2);i+=2;continue;}
   if(source[i]==='`'){const m=source.slice(i,end).match(/^`+/)[0],close=source.indexOf(m,i+m.length);if(close>=0&&close<end){for(let k=i+m.length;k<close;k++)emit(source[k],k,k+1);i=close+m.length;continue;}}
   if(source.startsWith('![[',i)){const close=source.indexOf(']]',i+3);if(close>=0&&close<end){i=close+2;continue;}}
   if(source.startsWith('[[',i)){const close=source.indexOf(']]',i+2);if(close>=0&&close<end){const pipe=source.lastIndexOf('|',close);const label=pipe>=i+2?pipe+1:i+2;inline(label,close);i=close+2;continue;}}
   if(source[i]==='['||source.startsWith('![',i)){const image=source[i]==='!',open=i+(image?1:0),close=bracketEnd(open,end);if(close>=0&&close<end&&source[close+1]==='('){let k=close+2,depth=1;for(;k<end&&depth;k++){if(source[k]==='(')depth++;if(source[k]===')')depth--;}
     if(!depth){if(!image)inline(open+1,close);i=k;continue;}}
    if(close>=0){const suffix=source.slice(close+1,end).match(/^\[([^\]]*)\]/);const label=(suffix?.[1]||source.slice(open+1,close)).trim().replace(/\s+/g,' ').toLowerCase();if(references.has(label)){if(!image)inline(open+1,close);i=close+1+(suffix?.[0].length||0);continue;}}}
   if(source.startsWith('<!--',i)){const close=source.indexOf('-->',i+4);if(close>=0){i=close+3;continue;}}
   if(source[i]==='<'){const close=source.indexOf('>',i+1);if(close>=0&&close<end){const tag=source.slice(i+1,close);if(/^https?:\/\//.test(tag)||/^[^ <>]+@[^ <>]+$/.test(tag))inline(i+1,close);i=close+1;continue;}}
   if(source[i]==='&'){const m=source.slice(i,end).match(/^&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/i);if(m){const key=m[1];let decoded=entities[key.toLowerCase()];if(key[0]==='#'){const num=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);if(num<=0x10ffff)decoded=String.fromCodePoint(num);}if(decoded){emit(decoded,i,i+m[0].length);i+=m[0].length;continue;}}}
   const delimiter=source.slice(i,end).match(/^(\*{1,3}|_{1,3}|~~|==)/)?.[0];
   if(delimiter){const close=source.indexOf(delimiter,i+delimiter.length);if(close>=0&&close<end){inline(i+delimiter.length,close);i=close+delimiter.length;continue;}}
   if(tableMode&&source[i]==='|'){i++;continue;}
   emit(source[i],i,i+1);i++;
  }
 }
 let cursor=0,fence=null,frontmatter=source.startsWith('---\n');
 const lines=source.split('\n');const tables=new Set();
 const tableLine=line=>line.replace(/^\s*(?:>\s*)+/, '');
 for(let row=1;row<lines.length;row++)if(tableLine(lines[row]).includes('|')&&/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(tableLine(lines[row]))){tables.add(row-1);tables.add(row);for(let k=row+1;k<lines.length&&tableLine(lines[k]).includes('|');k++)tables.add(k);}
 let row=-1;for(const line of lines){row++;tableMode=tables.has(row);
  const end=cursor+line.length;
  if(frontmatter){if(cursor>0&&/^---\s*$/.test(line))frontmatter=false;cursor=end+1;continue;}
  const quotePrefix=line.match(/^\s*(?:>[ \t]?)+/)?.[0].length||0;
  if(!fence&&/^\s{0,3}\[[^\]]+\]:\s*\S/.test(line.slice(quotePrefix))){cursor=end+1;continue;}
  const fm=line.slice(quotePrefix).match(/^\s*(`{3,}|~{3,})/);if(fm){fence=fence?null:fm[1];cursor=end+1;continue;}
  if(tableMode&&/^\s*[| :-]+$/.test(tableLine(line))){cursor=end+1;continue;}
  const prefix=fence?quotePrefix:(line.match(/^\s*(?:(?:>\s*)+)?(?:(?:#{1,6}\s+)|(?:[-+*]\s+(?:\[[^\]]\]\s+)?)|(?:\d+[.)]\s+))?/)?.[0].length||0);
  if(fence){for(let i=cursor+prefix;i<end;i++)emit(source[i],i,i+1);}else {const callout=source.slice(cursor+prefix,end).match(/^\[![^\]]+\][+-]?\s*/)?.[0].length||0;inline(cursor+prefix+callout,end);}
  emit('\n',end,Math.min(end+1,source.length));cursor=end+1;
 }
 if(chars.at(-1)==='\n'&&!source.endsWith('\n')){chars.pop();offsets.pop();}
 return {text:chars.join(''),offsets};
}
// Math is an atomic rendered object: every selected glyph anchors to its full TeX expression.
function renderedProjection(source,referenceSource=source,preserveReferences=false){
 const ranges=[];let i=0,fence=null;while(i<source.length){
  if(i===0||source[i-1]==='\n'){const m=source.slice(i).match(/^\s*(?:>\s*)*(`{3,}|~{3,})/);if(m){fence=fence?null:m[1];const e=source.indexOf('\n',i);i=e<0?source.length:e+1;continue;}}
  if(fence){i++;continue;}
  if(source[i]==='\\'){i+=2;continue;}
  if(source[i]==='`'){const tick=source.slice(i).match(/^`+/)[0],end=source.indexOf(tick,i+tick.length);i=end<0?i+tick.length:end+tick.length;continue;}
  if(source[i]!=='$'){i++;continue;}const delimiter=source.startsWith('$$',i)?'$$':'$';if(delimiter==='$'&&/\s/.test(source[i+1]||'')){i++;continue;}
  let end=i+delimiter.length;while((end=source.indexOf(delimiter,end))>=0){let escapes=0;for(let k=end-1;k>=0&&source[k]==='\\';k--)escapes++;if(escapes%2===0&&(delimiter==='$$'||!/[\s]/.test(source[end-1])&&!/\d/.test(source[end+1]||'')))break;end+=delimiter.length;}
  if(end<0||delimiter==='$'&&/[\n`]/.test(source.slice(i+1,end))){i+=delimiter.length;continue;}
  ranges.push({from:i,to:end+delimiter.length});i=end+delimiter.length;
 }
 let masked=source;for(const r of [...ranges].reverse())masked=masked.slice(0,r.from)+'\ufff9'+' '.repeat(r.to-r.from-1)+masked.slice(r.to);
 const projected=projectMarkdown(masked,{referenceSource,preserveReferences}),byStart=new Map(ranges.map(r=>[r.from,r]));for(let j=0;j<projected.offsets.length;j++){const p=projected.offsets[j],r=byStart.get(p.from);if(r)projected.offsets[j]=r;}return projected;
}
// Sidebar excerpts render only TeX; surrounding content stays plain text.
function mathRuns(source){const projected=renderedProjection(source),runs=[];let plain='';const flush=()=>{if(plain){runs.push({kind:'text',text:plain});plain='';}};
 for(let i=0;i<projected.text.length;i++){const p=projected.offsets[i];if(projected.text[i]==='\ufff9'&&source[p.from]==='$'){flush();const raw=source.slice(p.from,p.to),display=raw.startsWith('$$'),size=display?2:1;let tex=raw.slice(size,-size);if(display&&/\n[ \t]*>+[ \t]*\$\$$/.test(raw))tex=tex.replace(/(^|\n)[ \t]*(?:>[ \t]?)+/g,'$1');runs.push({kind:'math',tex:tex.trim(),display});while(i+1<projected.offsets.length&&projected.offsets[i+1].from<p.to)i++;}else plain+=projected.text[i];}flush();if(runs[0]?.kind==='text')runs[0].text=runs[0].text.trimStart();if(runs.at(-1)?.kind==='text')runs.at(-1).text=runs.at(-1).text.trimEnd();return runs.filter(r=>r.kind==='math'||r.text);
}
module.exports.mathRuns=mathRuns;
function visibleMap(source,visible,base=0,options={}) {
 let projected=options.math?renderedProjection(source,options.referenceSource||source):projectMarkdown(source,options);const compact=(text)=>{let value='',indices=[];for(let i=0;i<text.length;i++)if(!/[\s\u200b\ufeff]/.test(text[i])){value+=text[i];indices.push(i);}return {value,indices};};
 let a=compact(projected.text);const b=compact(visible);if(!b.value)return null;let hits=occurrences(a.value,b.value);if(!hits.length){projected=options.math?renderedProjection(source,options.referenceSource||source,true):projectMarkdown(source,{...options,preserveReferences:true});a=compact(projected.text);hits=occurrences(a.value,b.value);}if(hits.length!==1)return null;
 const map=Array(visible.length).fill(null);for(let j=0;j<b.indices.length;j++){const p=projected.offsets[a.indices[hits[0]+j]];map[b.indices[j]]={from:base+p.from,to:base+p.to};}return map;
}
module.exports.projectMarkdown=projectMarkdown;module.exports.visibleMap=visibleMap;

function paletteSide(rect,toolbar,palette,vp,gap=6){
 const bar=place(rect,toolbar,vp);
 return bar.top-palette.height-gap>=vp.top+8?'above':'below';
}
module.exports.paletteSide=paletteSide;

// Markdown heading hierarchy for the current-note highlights panel.
function highlightOutline(source,records,path){
 const root={id:'root',level:0,title:'',items:[],children:[],count:0};const stack=[root],headings=[];let offset=0,fence=null,frontmatter=source.startsWith('---\n')||source.startsWith('---\r\n');const lines=source.split('\n');
 for(let i=0;i<lines.length;i++){
  const line=lines[i].replace(/\r$/,'');let title,level;
  if(frontmatter){if(i>0&&/^(---|\.\.\.)\s*$/.test(line))frontmatter=false;offset+=lines[i].length+1;continue;}
  const f=line.match(/^ {0,3}(`{3,}|~{3,})/);if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&/^ {0,3}(`+|~+)\s*$/.test(line))fence=null;offset+=lines[i].length+1;continue;}
  if(!fence){const atx=line.match(/^ {0,3}(#{1,6})(?:[ \t]+|$)(.*)$/);if(atx){level=atx[1].length;title=atx[2].replace(/[ \t]+#+[ \t]*$/,'').trim();}
   else if(line.trim()&&!/^\s*(>|[-*+]\s|\d+[.)]\s)/.test(line)&&/^ {0,3}(=+|-+)\s*$/.test(lines[i+1]||'')){level=lines[i+1].trim()[0]==='='?1:2;title=line.trim();}
  }
  if(level){const h={id:offset+':'+level,from:offset,level,title:projectMarkdown(title).text,items:[],children:[],count:0};while(stack.length>1&&stack[stack.length-1].level>=level)stack.pop();stack[stack.length-1].children.push(h);stack.push(h);headings.push(h);}
  offset+=lines[i].length+1;
 }
 const sorted=records.filter(r=>r.path===path).map(r=>({r,p:resolve(r,source)})).sort((a,b)=>(a.p?.from??a.r.from)-(b.p?.from??b.r.from));
 for(const {r,p} of sorted){const node=p?headings.filter(h=>h.from<=p.from).at(-1)||root:root;node.items.push(r);}
 function prune(node){node.children=node.children.filter(child=>prune(child));node.count=node.items.length+node.children.reduce((n,c)=>n+c.count,0);return node.count>0;}prune(root);return root;
}
function outlineMarkdown(tree,title,excerpt){
 const out=['# '+title];function walk(node){if(node.level)out.push('#'.repeat(Math.min(6,node.level+1))+' '+node.title);for(const r of node.items)out.push(excerpt(r).split('\n').map(line=>'> '+line).join('\n'));for(const child of node.children)walk(child);}walk(tree);return out.join('\n\n')+'\n';
}
module.exports.highlightOutline=highlightOutline;module.exports.outlineMarkdown=outlineMarkdown;

// Empty dimensions mean unrestricted; selections OR within a dimension, AND across them.
function matchesHighlightFilter(record,filter={}){
 return (!filter.types?.length||filter.types.includes(record.style))&&(!filter.colors?.length||filter.colors.includes(record.color));
}
module.exports.matchesHighlightFilter=matchesHighlightFilter;
function badgeInk(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.35?'#453824':'#fff8ed';}
module.exports.badgeInk=badgeInk;
function flatHighlightGroups(tree){const out=[];function walk(node){if(node.items.length)out.push({id:node.id,title:node.title,items:node.items});for(const child of node.children)walk(child);}walk(tree);return out;}
function softStyleBadge(hex){const blend=(base,ratio)=>'#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*ratio+parseInt(base.slice(i,i+2),16)*(1-ratio)).toString(16).padStart(2,'0')).join('');return {background:blend('#ede9df',.22),ink:blend('#4e493f',.18)};}
module.exports.flatHighlightGroups=flatHighlightGroups;module.exports.softStyleBadge=softStyleBadge;
function dismissSheet(distance,duration,height){return distance>=Math.min(120,height*.22)||(distance>28&&distance/Math.max(1,duration)>.65);}
module.exports.dismissSheet=dismissSheet;

// Validate editor offsets against the actual DOM selection before saving an anchor.
// Live Preview can reveal Markdown prefixes while a mouse selection is in progress.
function editorSelectionBounds(source,selected,candidates,options={}){
 const compact=s=>s.replace(/[\s\u200b\ufeff]/g,'');const wanted=compact(selected),visible=projectMarkdown(selected).text,wantedVisible=compact(visible);if(!wanted)return null;
 const valid=candidates.filter(p=>Number.isInteger(p.from)&&Number.isInteger(p.to)&&p.from>=0&&p.to>=p.from&&p.to<=source.length);
 for(const p of valid){if(p.to===p.from)continue;const raw=source.slice(p.from,p.to);if(options.math){const map=visibleMap(raw,visible,p.from,options);const offsets=map?.filter(Boolean);if(offsets?.length)return {from:offsets[0].from,to:offsets.at(-1).to};}if(compact(raw)===wanted||(wantedVisible&&compact(projectMarkdown(raw).text)===wantedVisible))return p;}
 for(const p of valid){const start=source.lastIndexOf('\n',Math.max(-1,p.from-1))+1;const endAt=source.indexOf('\n',p.to);const end=endAt<0?source.length:endAt;const scope=source.slice(start,end);const exact=occurrences(scope,selected);
  if(exact.length===1)return {from:start+exact[0],to:start+exact[0]+selected.length};
  const map=visibleMap(scope,visible,start,options);if(map){const offsets=map.filter(Boolean);if(offsets.length)return {from:Math.min(...offsets.map(x=>x.from)),to:Math.max(...offsets.map(x=>x.to))};}
 }
 return null;
}
module.exports.editorSelectionBounds=editorSelectionBounds;

function mathBounds(source){const p=renderedProjection(source);return p.offsets.filter((r,i)=>p.text[i]==='\ufff9'&&source[r.from]==='$');}
module.exports.mathBounds=mathBounds;

function visualMarkLines(rects){const lines=[];for(const b of rects.filter(b=>b.right>b.left&&b.bottom>b.top).sort((a,b)=>a.top-b.top||a.left-b.left)){const line=lines.find(l=>Math.min(l.bottom,b.bottom)>Math.max(l.top,b.top));if(line){line.left=Math.min(line.left,b.left);line.right=Math.max(line.right,b.right);line.top=Math.min(line.top,b.top);line.bottom=Math.max(line.bottom,b.bottom);}else lines.push({...b});}return lines;}
module.exports.visualMarkLines=visualMarkLines;
