const {test}=require('node:test');const assert=require('node:assert/strict');
const {PALETTE,settings,anchor,resolve,place}=require('../core');
test('five independent color slots and custom settings validation',()=>{
 assert.equal(PALETTE.length,5);assert.equal(new Set(PALETTE.map(c=>c.id)).size,5);
 const s=settings({width:99,opacity:-2,colors:{'slot-2':'#abcdef','slot-3':'url(x)'},style:'evil'});
 assert.equal(s.width,5);assert.equal(s.opacity,.1);assert.equal(s.style,'highlight');assert.equal(s.colors['slot-2'],'#abcdef');assert.equal(s.colors['slot-3'],'#f7a3b3');
});
test('annotations reattach after prefix edits and preserve Chinese/emoji text',()=>{
 const text='前文 🍵 這是值得記住的一句話。\nAfter';const from=text.indexOf('這是');const r=anchor(text,from,text.indexOf('。'));
 assert.equal(r.quote,'這是值得記住的一句話');const next='New heading\n'+text;const p=resolve(r,next);assert.equal(next.slice(p.from,p.to),r.quote);
});
test('ambiguous moved passages are not guessed',()=>{
 const r={...anchor('before ABC after',7,10),from:100,to:103};assert.equal(resolve(r,'ABC then ABC'),null);
 assert.equal(resolve(r,'text deleted'),null);
});
test('context disambiguates repeated text',()=>{
 const text='one ABC first\nother ABC last',i=text.lastIndexOf('ABC');const r=anchor(text,i,i+3);
 const next='prefix '+text;const p=resolve(r,next);assert.equal(p.from,next.lastIndexOf('ABC'));
});
test('toolbar stays inside narrow, landscape, keyboard and zoom viewports',()=>{
 for(const [width,height,top,left] of [[320,568,0,0],[375,240,0,0],[390,844,0,0],[844,250,0,0],[240,350,130,45]]){
  for(const rect of [{left,right:left+50,top,bottom:top+24},{left:left+width-20,right:left+width,top:top+height-20,bottom:top+height}]){
   const p=place(rect,{width:410,height:200},{width,height,top,left});
   assert.ok(p.left>=left+8);assert.ok(p.top>=top+8);assert.ok(p.left+Math.min(410,p.maxWidth)<=left+width-8);assert.ok(p.top+Math.min(200,p.maxHeight)<=top+height-8);
  }
 }
});

test('duplicate newly inserted at old offset does not steal an existing annotation',()=>{
 const text='ABC original',r=anchor(text,0,3);
 const next='ABC inserted\n'+text;const p=resolve(r,next);assert.equal(p.from,next.lastIndexOf('ABC'));
});
const {upsert,segments}=require('../core');
const sample='abcdefghijklmnop';
function mark(from,to,id='old',style='highlight'){return {id,path:'note.md',...anchor(sample,from,to),style,color:'green',created:1};}
function choose(from,to){return {path:'note.md',...anchor(sample,from,to)};}
test('exact reselection updates an existing annotation rather than duplicating it',()=>{
 const result=upsert([mark(2,7)],choose(2,7),sample,{style:'wave'},{color:'yellow',style:'highlight'},'new',2);
 assert.equal(result.records.length,1);assert.equal(result.record.id,'old');assert.equal(result.record.style,'wave');
});
test('a covering selection expands and updates the old highlight',()=>{
 const result=upsert([mark(4,8)],choose(2,10),sample,{color:'blue'},{color:'yellow',style:'highlight'},'new',2);
 assert.equal(result.records.length,1);assert.equal(result.record.id,'old');assert.equal(result.record.quote,'cdefghij');
});
test('a one-character overlap merges into a single updated highlight',()=>{
 const result=upsert([mark(2,7)],choose(6,10),sample,{style:'wave'},{color:'yellow',style:'highlight'},'new',2);
 assert.equal(result.records.length,1);assert.equal(result.record.quote,'cdefghij');assert.equal(result.record.style,'wave');assert.equal(result.record.id,'old');
});
test('selecting inside a highlight recolors the whole original range',()=>{
 const result=upsert([mark(2,12)],choose(5,8),sample,{color:'slot-3'},{color:'green',style:'highlight'},'new',2);
 assert.equal(result.records.length,1);assert.equal(result.record.color,'slot-3');assert.equal(result.record.from,2);assert.equal(result.record.to,12);
});
test('existing nested and transitive duplicates consolidate without merging adjacent or other-note marks',()=>{
 const records=[mark(2,8,'one'),mark(5,10,'two'),mark(9,12,'three'),mark(12,14,'adjacent'),{...mark(3,6,'other'),path:'other.md'}];
 const result=upsert(records,choose(3,4),sample,{color:'slot-2'},{color:'green',style:'highlight'},'new',3);
 assert.equal(result.records.length,3);assert.equal(result.record.from,2);assert.equal(result.record.to,12);assert.ok(result.records.some(r=>r.id==='other'));assert.ok(result.records.some(r=>r.id==='adjacent'));
});
test('covering multiple old marks merges them while preserving unrelated marks',()=>{
 const result=upsert([mark(2,4,'one'),mark(5,7,'two'),mark(13,15,'other')],choose(1,9),sample,{style:'underline'},{color:'green',style:'highlight'},'new',2);
 assert.equal(result.records.length,2);assert.equal(result.record.id,'one');assert.ok(result.records.some(r=>r.id==='other'));
});
test('chosen slot and its custom color survive settings reload',()=>{
 const s=settings({color:'slot-5',colors:{'slot-5':'#abcdef'}});assert.equal(s.color,'slot-5');assert.equal(settings(JSON.parse(JSON.stringify(s))).colors['slot-5'],'#abcdef');
});
const {selectedMark}=require('../core');
test('one selected character addresses the whole highlight for deletion',()=>{
 const r=mark(2,10);for(const i of [2,5,9])assert.equal(selectedMark([r],choose(i,i+1),sample).id,r.id);
 assert.equal(selectedMark([r],choose(10,11),sample),undefined);
});
test('deleting the latest overlapping highlight leaves the older record intact',()=>{
 const old=mark(2,10,'old'),latest={...mark(5,12,'latest'),updated:2};
 const target=selectedMark([old,latest],choose(6,7),sample);assert.equal(target.id,'latest');
 const remaining=[old,latest].filter(r=>r.id!==target.id);assert.equal(remaining.length,1);assert.equal(remaining[0].quote,'cdefghij');
});
test('single-character targeting follows edits and stays within its note',()=>{
 const r=mark(2,10);const next='prefix '+sample;const p={path:'note.md',from:12,to:13};
 assert.equal(selectedMark([r],p,next).id,'old');assert.equal(selectedMark([r],{...p,path:'other.md'},next),undefined);
});
const {projectMarkdown,visibleMap}=require('../core');
test('mixed Chinese, English, bold, italic, highlight and inline code map back to source',()=>{
 const source='中文 **important**、*輕輕提醒*、==一句話== 與 `LocalDate.now()`。';
 const visible='中文 important、輕輕提醒、一句話 與 LocalDate.now()。';const map=visibleMap(source,visible,100);assert.ok(map);
 const a=visible.indexOf('important'),b=visible.indexOf('now()')+5;const mapped=map.slice(a,b).filter(Boolean);
 assert.equal(source.slice(mapped[0].from-100,mapped.at(-1).to-100),'important**、*輕輕提醒*、==一句話== 與 `LocalDate.now()');
});
test('cross-paragraph selection maps through headings and Markdown links',()=>{
 const source='# Heading\n\nFirst **中文**.\n\nSecond [English](https://example.com) &amp; more.';
 const visible='HeadingFirst 中文.Second English & more.';const map=visibleMap(source,visible);assert.ok(map);
 assert.equal(source[map[visible.indexOf('Second')].from],'S');
 assert.equal(source.slice(map[visible.indexOf('&')].from,map[visible.indexOf('&')].to),'&amp;');
});
test('reading projection preserves code punctuation, escapes and wiki labels',()=>{
 const source='Use `a_b * c` and \\*literal\\* plus [[folder/note|筆記]].';
 assert.equal(projectMarkdown(source).text,'Use a_b * c and *literal* plus 筆記.');
});
test('reading tables map text without Markdown column separators',()=>{
 const source='| 名稱 | Code |\n| --- | --- |\n| 中文 | `foo()` |';
 assert.ok(visibleMap(source,'名稱Code中文foo()'));
});
test('callout title and body can map together',()=>{
 assert.ok(visibleMap('> [!tip]+ Title\n> Some **中文** text.','TitleSome 中文 text.'));
});
test('visible excerpt is retained separately from Markdown source anchor',()=>{
 const text='**中文** and `code`';const pending={path:'note.md',...anchor(text,2,text.length-1),display:'中文 and code'};
 const result=upsert([],pending,text,{style:'highlight'},{color:'green',style:'highlight'},'new',2);
 assert.equal(result.record.display,'中文 and code');assert.equal(result.record.quote,'中文** and `code');
});
test('five configurable toolbar slots and highlight height validate safely',()=>{
 const s=settings({quickColors:['mint','red','purple','blue','lemon'],height:20});assert.equal(Object.keys(s.colors).length,5);assert.equal(s.colors['slot-1'],'#91f476');assert.equal(s.height,5);
});
const {migrateData,slotHex}=require('../core');
test('changing blue slot to yellow recolors old highlights and sidebar without rewriting annotations',()=>{
 const config=settings();const note={...mark(2,7),color:'slot-5'},sidebar={...note};
 assert.equal(slotHex(note,config),'#a9eae2');config.colors['slot-5']='#f6cf64';
 assert.equal(slotHex(note,config),'#f6cf64');assert.equal(slotHex(sidebar,config),'#f6cf64');assert.equal(note.color,'slot-5');
});
test('all five customized slots persist and independently recolor all three styles',()=>{
 const config=settings({colors:{'slot-1':'#111111','slot-2':'#222222','slot-3':'#333333','slot-4':'#444444','slot-5':'#555555'}});
 const reloaded=settings(JSON.parse(JSON.stringify(config)));assert.deepEqual(reloaded.colors,config.colors);
 for(const c of PALETTE)for(const style of ['highlight','wave','underline'])assert.equal(slotHex({color:c.id,style},reloaded),config.colors[c.id]);
});
test('legacy data migrates to five slot references with original IDs, text and ranges intact',()=>{
 const old={schema:1,settings:{quickColors:['green','lemon','pink','purple','blue'],colors:{green:'#20c933',blue:'#8899ef'}},records:[{...mark(2,7),color:'blue'},{...mark(8,10,'custom'),color:'custom',hex:'#aabbee'}]};
 const next=migrateData(old);assert.equal(next.schema,2);assert.equal(next.records.length,2);assert.equal(next.records[0].color,'slot-5');assert.equal(next.records[0].id,'old');assert.equal(next.records[0].quote,'cdefg');assert.equal(next.records[0].from,2);assert.ok(PALETTE.some(c=>c.id===next.records[1].color));assert.equal(next.records[1].hex,undefined);
 assert.deepEqual(migrateData(next),next);assert.equal(old.records[1].hex,'#aabbee');
});
test('legacy customized toolbar colors are retained in their slots',()=>{
 const config=settings({quickColors:['green','lemon','pink','purple','blue'],colors:{green:'#92c89d',blue:'#93a8df'}});
 assert.equal(config.colors['slot-1'],'#92c89d');assert.equal(config.colors['slot-5'],'#93a8df');assert.equal(config.customColor,undefined);assert.equal(config.quickColors,undefined);
});
const {paletteSide}=require('../core');
test('palette prefers above the toolbar on desktop and mobile',()=>{
 for(const width of [320,390,1440])assert.equal(paletteSide({left:40,right:100,top:300,bottom:325},{width:144,height:40},{width:156,height:36},{left:0,top:0,width,height:568}),'above');
});
test('palette falls below when toolbar has no room above, including keyboard viewport',()=>{
 assert.equal(paletteSide({left:40,right:100,top:0,bottom:20},{width:144,height:40},{width:156,height:36},{left:0,top:0,width:320,height:568}),'below');
 assert.equal(paletteSide({left:40,right:100,top:100,bottom:120},{width:144,height:40},{width:156,height:36},{left:0,top:100,width:390,height:240}),'below');
});

test('factory colors display yellow teal green red purple without changing stored identities',()=>{assert.deepEqual(PALETTE.map(c=>c.id),['slot-2','slot-5','slot-1','slot-3','slot-4']);assert.deepEqual(PALETTE.map(c=>c.hex),['#fdf85d','#a9eae2','#91f476','#f7a3b3','#ceaef4']);});
const {highlightOutline,outlineMarkdown}=require('../core');
test('outline groups only current-note marks under nearest heading with ancestors and article order',()=>{
 const text='Intro text\n# Chapter\nfirst\n## Section\nsecond\n### Detail\nthird\n## Empty\nnone';const record=(quote,id,path='a.md')=>({id,path,...anchor(text,text.indexOf(quote),text.indexOf(quote)+quote.length),style:'highlight',color:id});
 const tree=highlightOutline(text,[record('third','slot-1'),record('first','slot-5'),record('Intro text','slot-3'),record('second','slot-2'),record('first','other','b.md')],'a.md');
 assert.equal(tree.count,4);assert.equal(tree.items[0].quote,'Intro text');assert.equal(tree.children.length,1);assert.equal(tree.children[0].title,'Chapter');assert.equal(tree.children[0].children[0].title,'Section');assert.equal(tree.children[0].children[0].children[0].title,'Detail');assert.equal(tree.children[0].count,3);
 const copied=outlineMarkdown(tree,'Note',r=>r.quote);assert.ok(copied.indexOf('first')<copied.indexOf('second'));assert.ok(copied.indexOf('second')<copied.indexOf('third'));assert.ok(copied.includes('#### Detail'));assert.ok(!copied.includes('slot-'));
});
test('outline ignores frontmatter and fenced headings, supports setext and repeated heading labels',()=>{
 const text='---\ntitle: test\n---\nTitle\n=====\n```md\n# Fake\n```\n## Same\nApple\n## Same\nPear';const records=['Apple','Pear'].map((quote,i)=>({id:String(i),path:'a.md',...anchor(text,text.indexOf(quote),text.indexOf(quote)+quote.length)}));const tree=highlightOutline(text,records,'a.md');assert.equal(tree.children.length,1);assert.equal(tree.children[0].title,'Title');assert.equal(tree.children[0].children.length,2);assert.notEqual(tree.children[0].children[0].id,tree.children[0].children[1].id);
});
const {matchesHighlightFilter}=require('../core');
test('style/color filters OR within selections and AND between dimensions; empty means all',()=>{
 const r={style:'wave',color:'slot-4'};assert.equal(matchesHighlightFilter(r,{}),true);assert.equal(matchesHighlightFilter(r,{types:['highlight','wave'],colors:['slot-4']}),true);assert.equal(matchesHighlightFilter(r,{types:['highlight'],colors:['slot-4']}),false);assert.equal(matchesHighlightFilter(r,{types:['wave'],colors:['slot-1','slot-2']}),false);assert.equal(matchesHighlightFilter(r,{types:[],colors:['slot-4']}),true);assert.equal(matchesHighlightFilter(r,{types:['wave'],colors:[]}),true);
});
test('round style badges keep icons readable on custom black and pale colors',()=>{const {badgeInk}=require('../core');assert.equal(badgeInk('#000000'),'#fff8ed');assert.equal(badgeInk('#fdf85d'),'#453824');assert.equal(badgeInk('#a9eae2'),'#453824');});
test('flat groups keep direct headings in article order without nesting or repeated ancestor labels',()=>{
 const {flatHighlightGroups}=require('../core');const text='# Parent\nintro\n## Table\ncell\n### Code\ncode';const records=['intro','cell','code'].map((quote,i)=>({id:String(i),path:'a.md',...anchor(text,text.indexOf(quote),text.indexOf(quote)+quote.length)}));const groups=flatHighlightGroups(highlightOutline(text,records,'a.md'));assert.deepEqual(groups.map(g=>g.title),['Parent','Table','Code']);assert.deepEqual(groups.map(g=>g.items.length),[1,1,1]);const onlyCode=flatHighlightGroups(highlightOutline(text,[records[2]],'a.md'));assert.deepEqual(onlyCode.map(g=>g.title),['Code']);
});
test('soft icon colors desaturate bright swatches without modifying original palette values',()=>{
 const {softStyleBadge}=require('../core');const original='#91f476';const b=softStyleBadge(original);assert.notEqual(b.background,original);assert.notEqual(b.ink,b.background);assert.equal(original,'#91f476');assert.match(softStyleBadge('#000000').background,/^#[0-9a-f]{6}$/);
});
test('bottom sheet dismisses deliberate downward drags, but snaps short slow or upward drags back',()=>{const {dismissSheet}=require('../core');assert.equal(dismissSheet(130,800,600),true);assert.equal(dismissSheet(45,50,600),true);assert.equal(dismissSheet(20,200,600),false);assert.equal(dismissSheet(35,500,600),false);assert.equal(dismissSheet(-80,100,600),false);assert.equal(dismissSheet(70,500,300),true);});
const {editorSelectionBounds}=require('../core');
test('Live Preview heading selection repairs stale offsets when Markdown prefix appears',()=>{
 const source='Before\n\n## 提示框與引用\n\nAfter';const start=source.indexOf('##'),end=source.indexOf('\n',start);
 assert.deepEqual(editorSelectionBounds(source,'## 提示框與引用',[{from:start+4,to:end}]),{from:start,to:end});
 assert.deepEqual(editorSelectionBounds(source,'提示框與引用',[{from:start+4,to:end}]),{from:start+3,to:end});
 assert.deepEqual(editorSelectionBounds(source,'提示框',[{from:start+4,to:start+6}]),{from:start+3,to:start+6});
});
test('editor range validation preserves correct source spans for all heading levels and formatted text',()=>{
 for(let level=1;level<=6;level++){const source='#'.repeat(level)+' **中文 heading**';const selection=source;assert.deepEqual(editorSelectionBounds(source,selection,[{from:0,to:source.length}]),{from:0,to:source.length});}
 const source='## **中文 heading**';assert.deepEqual(editorSelectionBounds(source,'中文 heading',[{from:3,to:source.length}]),{from:3,to:source.length});
 assert.equal(editorSelectionBounds('## 重複 重複','重複',[{from:0,to:1}]),null);
});

test('callout tables map cells without quote prefixes, pipes or separator rows',()=>{
 const source='> [!question] Metrics\n> | Metric | Meaning |\n> | --- | --- |\n> | Precision | True positives |';const visible='MetricsMetricMeaningPrecisionTrue positives';const map=visibleMap(source,visible);assert.ok(map);const a=visible.indexOf('True');assert.equal(source.slice(map[a].from,map.at(-1).to),'True positives');
});
test('a rendered formula maps atomically without blocking surrounding callout text',()=>{
 const source='> [!question] Metrics\n> Short answer: Precision.\n> Formula: $P=\\frac{TP}{TP+FP}$ and recall.';const visible='MetricsShort answer: Precision.Formula: \ufff9 and recall.';const map=visibleMap(source,visible,0,{math:true});assert.ok(map);const m=map[visible.indexOf('\ufff9')];assert.equal(source.slice(m.from,m.to),'$P=\\frac{TP}{TP+FP}$');const at=visible.indexOf('Precision');assert.equal(source.slice(map[at].from,map[at+8].to),'Precision');
});

test('rendered math mapping leaves currency and inline code literal',()=>{for(const source of ['Cost $5 and $10 today.','Use `price $5 and $10` here.'])assert.ok(visibleMap(source,projectMarkdown(source).text,0,{math:true}));});
test('single-column table formulas retain an exact atomic source anchor',()=>{const source='| Formula |\n| --- |\n| $P=TP/(TP+FP)$ |';const visible='Formula\ufff9';const map=visibleMap(source,visible,0,{math:true});assert.ok(map);assert.equal(source.slice(map.at(-1).from,map.at(-1).to),'$P=TP/(TP+FP)$');});

for(const [name,body] of [
 ['wiki image','![[QA image.svg]]'],['resized wiki image','![[QA image.svg|180]]'],['image alias','![[QA image.svg|Preview]]'],['markdown image','![Preview](QA%20image.svg)'],['remote image','![Preview](https://example.invalid/image.png)'],['missing image','![[missing-qa-image.png]]'],['reference image','![Preview][picture]\n> [picture]: QA%20image.svg']
])test('text around '+name+' remains selectable in callouts',()=>{const source='> [!note] Media\n> Before image.\n> '+body+'\n> After image.';const visible='MediaBefore image.After image.';const map=visibleMap(source,visible,0,{math:true});assert.ok(map);const at=visible.indexOf('After');assert.equal(source.slice(map[at].from,map.at(-1).to),'After image.');});
test('quote code fences preserve literal punctuation and ignore the quote markers',()=>{const source='> Before.\n> ```js\n> const value = "$5";\n> ```\n> After.';const visible='Before.const value = "$5";After.';assert.ok(visibleMap(source,visible,0,{math:true}));});
test('a nested quote with image, formula and table keeps exact text offsets',()=>{const source='> Outer.\n> > [!tip] Nested\n> > ![[QA image.svg|100]]\n> > Formula $x^2$.\n> > | Key | Value |\n> > | --- | --- |\n> > | alpha | beta |\n> > Tail 中文 🏝️.';const visible='Outer.NestedFormula \ufff9.KeyValuealphabetaTail 中文 🏝️.';const map=visibleMap(source,visible,0,{math:true});assert.ok(map);const at=visible.indexOf('中文');assert.equal(source.slice(map[at].from,map.at(-1).to),'中文 🏝️.');});
test('image-looking source inside inline code is still literal selectable text',()=>{const source='Use `![[not-an-image.png]]` here.';assert.ok(visibleMap(source,'Use ![[not-an-image.png]] here.',0,{math:true}));});

test('linked Markdown images do not leak alt text or destinations into the visible map',()=>{const source='Before [![Preview](qa.png)](https://example.invalid/view) after.';assert.ok(visibleMap(source,'Before  after.',0,{math:true}));});
test('undefined image references remain literal and duplicate blocks are not guessed',()=>{const literal='Before ![missing][unknown] after.';assert.equal(projectMarkdown(literal).text,literal);assert.equal(visibleMap('> Repeat.\n\n> Repeat.','Repeat.',0,{math:true}),null);});
test('reference image definitions outside a rendered section do not block that section',()=>{const section='> [!note] Reference\n> Before.\n> ![Preview][picture]\n> After.';const source=section+'\n\n[picture]: assets/image.png';const map=visibleMap(section,'ReferenceBefore.After.',0,{math:true,referenceSource:source});assert.ok(map);assert.equal(source.slice(map.at(-1).from,map.at(-1).to),'.');});
test('unresolved reference images shown literally by a Live Preview widget still map with a global definition',()=>{const section='> [!note] Reference\n> Before.\n> ![Fixture][picture]\n> After.';const whole=section+'\n\n[picture]: image.png';const map=visibleMap(section,'ReferenceBefore.![Fixture][picture]After.',0,{math:true,referenceSource:whole});assert.ok(map);assert.equal(section.slice(map.at(-6).from,map.at(-1).to),'After.');});
test('a media selection anchor trims the image and blank lines before the actual quote',()=>{const {editorSelectionBounds}=require('../core');const source='> ![[valid-image.svg]]\n>\n> NestedText: 中文 and English 🏝️.';const result=editorSelectionBounds(source,'> NestedText: 中文 and English 🏝️.',[{from:0,to:source.length}],{math:true,referenceSource:source});assert.ok(result);assert.equal(source.slice(result.from,result.to),'NestedText: 中文 and English 🏝️.');});
test('math excerpt runs preserve text and exact TeX without dollar delimiters or padding',()=>{const {mathRuns}=require('../core');assert.deepEqual(mathRuns('**Formula** $x^2+y^2=z^2$.'),[{kind:'text',text:'Formula '},{kind:'math',tex:'x^2+y^2=z^2',display:false},{kind:'text',text:'.'}]);assert.deepEqual(mathRuns('$$\nP=\\frac{TP}{TP+FP}\n$$'),[{kind:'math',tex:'P=\\frac{TP}{TP+FP}',display:true}]);assert.ok(!mathRuns('Cost $5 and $10; use `$x$`.').some(r=>r.kind==='math'));});

test('math source bounds distinguish repeated expressions and ignore literal code',()=>{const {mathBounds}=require('../core');const source='First $x^2$ then $x^2$ and `$fake$`.';const ranges=mathBounds(source);assert.equal(ranges.length,2);assert.equal(source.slice(ranges[0].from,ranges[0].to),'$x^2$');assert.equal(source.slice(ranges[1].from,ranges[1].to),'$x^2$');assert.notEqual(ranges[0].from,ranges[1].from);});

test('formula and prose share one continuous mark per wrapped visual line',()=>{const {visualMarkLines}=require('../core');const lines=visualMarkLines([{left:10,right:70,top:10,bottom:30},{left:70,right:150,top:3,bottom:34},{left:150,right:155,top:10,bottom:30},{left:10,right:60,top:42,bottom:62}]);assert.deepEqual(lines,[{left:10,right:155,top:3,bottom:34},{left:10,right:60,top:42,bottom:62}]);});

test('fresh installs start with visible Color 1 while existing choices are preserved',()=>{assert.equal(settings().color,PALETTE[0].id);assert.equal(migrateData().settings.color,PALETTE[0].id);assert.equal(settings({color:'slot-2'}).color,'slot-2');assert.equal(settings({color:'slot-4'}).color,'slot-4');});

test('quoted fenced code previews preserve text, language, quote depth and source bounds',()=>{const {quotedCodeBlocks}=require('../core');const source='> Before.\n>\n> ```js\n> const value = "$5";\n> ```\n>\n> After.';const blocks=quotedCodeBlocks(source);assert.equal(blocks.length,1);assert.equal(blocks[0].language,'js');assert.equal(blocks[0].depth,1);assert.equal(blocks[0].code,'const value = "$5";');assert.equal(source.slice(blocks[0].from,blocks[0].to),'> ```js\n> const value = "$5";\n> ```');});
test('quoted code support leaves native callouts, incomplete fences and indented fences alone',()=>{const {quotedCodeBlocks}=require('../core');for(const source of ['> [!note] Native\n> ```js\n> code\n> ```','> [!note] Outer\n> > ```java\n> > code\n> > ```','> ```js\n> unfinished','> \t```java\n> code\n> \t```'])assert.equal(quotedCodeBlocks(source).length,0);const source='> > ```java\n> > // 中文\n> > ```';assert.equal(quotedCodeBlocks(source)[0].depth,2);assert.equal(quotedCodeBlocks(source)[0].code,'// 中文');});

test('quote-looking examples inside an ordinary fenced code block stay literal',()=>{const {quotedCodeBlocks}=require('../core');assert.equal(quotedCodeBlocks('````md\n> ```js\n> example();\n> ```\n````').length,0);});
