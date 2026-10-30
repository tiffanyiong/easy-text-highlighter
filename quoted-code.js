// Plain blockquotes do not receive Obsidian's native callout code widgets.
// Replace only complete quoted fences in Live Preview; keep source editing native.
const {StateField}=require('@codemirror/state');
const {WidgetType,Decoration,EditorView}=require('@codemirror/view');
const {MarkdownRenderer,Component,editorInfoField,editorLivePreviewField}=require('obsidian');
function quoteCodeExtension(owner,parse){
 class QuoteCodeWidget extends WidgetType {
  constructor(block,path){super();this.block=block;this.path=path;}
  eq(other){return this.path===other.path&&JSON.stringify(this.block)===JSON.stringify(other.block);}
  toDOM(view){
   const dom=view.dom.ownerDocument.createElement('div');dom.className='aih-quote-code-preview';
   dom.style.setProperty('--aih-quote-depth',String(this.block.depth));
   const content=dom.createDiv({cls:'markdown-rendered'}),child=new Component();owner.addChild(child);
   const entry={el:content,ctx:{sourcePath:this.path,getSectionInfo:()=>({lineStart:this.block.lineStart,lineEnd:this.block.lineEnd})}};
   dom.aihQuoteChild=child;dom.aihQuoteEntry=entry;owner.sections.add(entry);
   // A longer fence safely contains literal backticks in the code itself.
   const fence='`'.repeat(Math.max(3,...[...this.block.code.matchAll(/`+/g)].map(m=>m[0].length+1)));
   void MarkdownRenderer.render(owner.app,fence+this.block.language+'\n'+this.block.code+'\n'+fence,content,this.path,child).then(()=>{
    if(dom.aihQuoteChild!==child||owner.unloading)return;
    void owner.renderSection(entry,view.state.doc.toString());view.requestMeasure();
   }).catch(error=>{console.warn('Highlighter quoted code preview',error);content.textContent=this.block.code;});
   dom.addEventListener('dblclick',event=>{
    if(event.target.closest('button'))return;
    // Double-click opens the original source; a normal drag selects rendered code.
    event.preventDefault();view.dispatch({selection:{anchor:this.block.contentFrom}});view.focus();
   });
   return dom;
  }
  ignoreEvent(){return true;}
  destroy(dom){owner.sections.delete(dom.aihQuoteEntry);const child=dom.aihQuoteChild;dom.aihQuoteChild=null;if(child)owner.removeChild(child);}
 }
 const build=state=>{
  if(!state.field(editorLivePreviewField,false))return Decoration.none;
  const path=state.field(editorInfoField,false)?.file?.path;if(!path)return Decoration.none;
  const blocks=parse(state.doc.toString()).filter(block=>!state.selection.ranges.some(range=>range.from<=block.to&&range.to>=block.from));
  return Decoration.set(blocks.map(block=>Decoration.replace({widget:new QuoteCodeWidget(block,path),block:true}).range(block.from,block.to)),true);
 };
 return StateField.define({create:build,update:(value,tr)=>tr.docChanged||tr.selection||tr.startState.field(editorLivePreviewField,false)!==tr.state.field(editorLivePreviewField,false)?build(tr.state):value,provide:field=>EditorView.decorations.from(field)});
}
module.exports={quoteCodeExtension};
