const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const {LANGUAGES,TRANSLATIONS,locale}=require('../i18n');const {settings}=require('../core');
const source=fs.readFileSync(require.resolve('../plugin.js'),'utf8');const words=vm.runInNewContext('('+source.match(/const words=(\{[\s\S]*?\n\});/)[1]+')');
for(const [code,translation] of Object.entries(TRANSLATIONS))test(code+' translates every UI string and survives settings reload',()=>{
 assert.equal(settings({language:code}).language,code);assert.equal(locale(code),code);
 for(const key of Object.keys(words))assert.ok(typeof translation[key]==='string'&&translation[key].trim(),code+': missing '+key);
});
test('Auto resolves Obsidian locale variants and falls back to English',()=>{
 for(const [raw,expected] of Object.entries({'zh_CN':'zh-CN','zh-SG':'zh-CN','zh-TW':'zh','zh-Hant':'zh','zh-HK':'zh','ja-JP':'ja','ko-KR':'ko','es-ES':'es','fr-CA':'fr','pt-BR':'pt','de-DE':'de','it-IT':'it','unknown':'en'}))assert.equal(locale(raw),expected);
 assert.equal(settings({language:'zh'}).language,'zh');assert.equal(Object.keys(LANGUAGES).length,11);
});
