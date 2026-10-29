const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');const manifest=JSON.parse(read('manifest.json'));const pkg=JSON.parse(read('package.json'));
assert.match(manifest.version,/^\d+\.\d+\.\d+$/);assert.equal(pkg.version,manifest.version);assert.equal(manifest.name,'Easy Text Highlighter');assert.ok(!manifest.id.includes('obsidian'));assert.ok(manifest.description.length<=250&&manifest.description.endsWith('.'));assert.equal(JSON.parse(read('versions.json'))[manifest.version],manifest.minAppVersion);
for(const f of ['main.js','styles.css','LICENSE','README.md','README.zh-TW.md','CHANGELOG.md'])assert.ok(read(f).trim(),f);
const before=read('main.js');cp.execFileSync(process.execPath,['build.js'],{cwd:root});assert.equal(read('main.js'),before,'Committed build differs from source');
assert.ok(!/\brequire\(['"](?:node:|fs['"]|os['"]|electron['"])/.test(before),'Desktop-only dependency in runtime');assert.ok(!/\b(?:eval|fetch)\s*\(/.test(before),'Unexpected dynamic code or network request');
for(const f of ['README.md','README.zh-TW.md'])for(const [,target]of read(f).matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)){assert.ok(fs.existsSync(path.join(root,target)),f+': missing image '+target);}
console.log('Release checks passed: metadata, build reproducibility, assets and runtime boundaries.');
