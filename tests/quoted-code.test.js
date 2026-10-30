const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const {EditorState,StateField}=require('@codemirror/state');const {WidgetType,Decoration,EditorView}=require('@codemirror/view');const {quotedCodeBlocks,visibleMap}=require('../core');
const info=StateField.define({create:()=>({file:{path:'quotes.md'}}),update:x=>x});
const live=StateField.define({create:()=>true,update:x=>x});
function extension(){const context={module:{exports:{}},console,require:name=>name==='@codemirror/state'?{StateField}:name==='@codemirror/view'?{WidgetType,Decoration,EditorView}:{editorInfoField:info,editorLivePreviewField:live}};vm.runInNewContext(fs.readFileSync(require.resolve('../quoted-code'),'utf8'),context);return context.module.exports.quoteCodeExtension({},quotedCodeBlocks);}
function widgets(state,field){const result=[];state.field(field).between(0,state.doc.length,(from,to,value)=>result.push({from,to,widget:value.spec.widget}));return result;}
test('quoted code is rendered in Live Preview and returns to editable source when its cursor enters',()=>{
 const text='Before\n> ```java\n> // 中文\n> int n = 5;\n> ```\nAfter';const field=extension();const state=EditorState.create({doc:text,extensions:[info,live,field]});const items=widgets(state,field);assert.equal(items.length,1);assert.equal(items[0].widget.block.language,'java');assert.equal(items[0].widget.block.code,'// 中文\nint n = 5;');
 const editing=state.update({selection:{anchor:items[0].widget.block.contentFrom}}).state;assert.equal(widgets(editing,field).length,0);assert.equal(editing.doc.toString(),text);
 const away=editing.update({selection:{anchor:text.length}}).state;assert.equal(widgets(away,field).length,1);
});
test('Source mode and native callouts keep their original editor rendering',()=>{
 const field=extension(),source='Before\n> ```js\n> value();\n> ```';const state=EditorState.create({doc:source,extensions:[info,field]});assert.equal(widgets(state,field).length,0);
 const native=EditorState.create({doc:'Before\n> [!note]\n> ```js\n> value();\n> ```',extensions:[info,live,field]});assert.equal(widgets(native,field).length,0);
});
test('rendered quoted code maps a selection back to its literal source without editing the note',()=>{
 const source='Before\n> ```js\n> const value = "$5";\n> ```\nAfter';const block=quotedCodeBlocks(source)[0],visible=block.code;const map=visibleMap(source.slice(block.from,block.to),visible,block.from,{math:true});assert.ok(map);const from=visible.indexOf('value'),to=from+5;assert.equal(source.slice(map[from].from,map[to-1].to),'value');
});
