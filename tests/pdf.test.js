const {test}=require('node:test');const assert=require('node:assert/strict');
const {anchor,matchesHighlightFilter,slotHex,settings,outlineMarkdown}=require('../core');
const {pdfUpsert,pdfContains,pdfSelected,pdfTree,pdfPartsValid}=require('../pdf');
const defaults={color:'slot-5',style:'highlight'};
function selection(text,from,to,page=1,path='book.pdf'){const quote=text.slice(from,to);return {kind:'pdf',path,parts:[{page,...anchor(text,from,to)}],quote,from:0,to:quote.length};}
test('PDF creation and recoloring preserve a single annotation and support one-character deletion targeting',()=>{
 const text='without touching normal';let pending=selection(text,0,16);const first=pdfUpsert([],pending,new Map([[1,text]]),{},defaults,'one',1);assert.equal(first.record.quote,'without touching');assert.ok(pdfPartsValid(first.record.parts));
 pending=selection(text,8,9);assert.ok(pdfContains(first.record,pending));assert.equal(pdfSelected(first.records,pending).id,'one');const changed=pdfUpsert(first.records,pending,new Map([[1,text]]),{color:'slot-3'},defaults,'two',2);assert.equal(changed.records.length,1);assert.equal(changed.record.color,'slot-3');assert.equal(changed.record.quote,'without touching');assert.equal(changed.record.id,'one');
 const extension=selection(text,0,text.length);assert.equal(pdfContains(first.record,extension),false);const larger=pdfUpsert(changed.records,extension,new Map([[1,text]]),{},defaults,'three');assert.equal(larger.records.length,1);assert.equal(larger.record.quote,text);
});
test('PDF overlap merging isolates pages and files, leaves adjacent marks separate',()=>{
 const text='same text on every page',texts=new Map([[1,text],[2,text]]);let records=[];for(const [page,path,id]of [[1,'a.pdf','a'],[2,'a.pdf','b'],[1,'b.pdf','c']])records=pdfUpsert(records,selection(text,0,4,page,path),texts,{},defaults,id).records;
 assert.equal(records.length,3);records=pdfUpsert(records,selection(text,4,9,1,'a.pdf'),texts,{},defaults,'d').records;assert.equal(records.length,4);
 records=pdfUpsert(records,selection(text,1,6,1,'a.pdf'),texts,{style:'wave'},defaults,'e').records;assert.equal(records.length,3);assert.equal(records.find(r=>r.id==='a').quote,'same text');assert.equal(records.find(r=>r.id==='b').parts[0].page,2);assert.equal(records.find(r=>r.id==='c').path,'b.pdf');
});
test('multi-page PDF selections group by page, filter and inherit customized palette',()=>{
 const a='first page passage',b='second page passage';const pending={...selection(a,0,a.length),parts:[{page:1,...anchor(a,0,a.length)},{page:2,...anchor(b,0,b.length)}]};
 const result=pdfUpsert([],pending,new Map([[1,a],[2,b]]),{style:'underline'},defaults,'multi');assert.equal(result.record.parts.length,2);assert.equal(result.record.quote,a+'\n'+b);assert.ok(pdfContains(result.record,selection(b,0,1,2)));assert.ok(matchesHighlightFilter(result.record,{types:['underline'],colors:['slot-5']}));assert.equal(slotHex(result.record,settings({colors:{'slot-5':'#111111'}})),'#111111');
 const tree=pdfTree(result.records,'Page');assert.equal(tree.count,1);assert.equal(tree.children[0].title,'Page 1');assert.match(outlineMarkdown(tree,'Book',r=>r.quote),/> first page passage\n> second page passage/);
});
test('unresolved or unavailable PDF text never attaches a mark to a guessed passage',()=>{
 const pending=selection('original passage',0,8);assert.equal(pdfUpsert([],pending,new Map([[1,'a different page']]),{},defaults,'bad'),null);assert.equal(pdfUpsert([],pending,new Map(),{},defaults,'bad'),null);assert.equal(pdfPartsValid([{page:0,from:0,to:2,quote:'ab'}]),false);
});
