import obsidianmd from 'eslint-plugin-obsidianmd';

export default [
  ...obsidianmd.configs.recommended,
  {ignores:['main.js','node_modules/**','tests/**','scripts/**','build.js','docs/**']},
  {
    files:['plugin.js','core.js','i18n.js'],
    languageOptions:{sourceType:'commonjs',globals:{console:'readonly',navigator:'readonly',Event:'readonly',setTimeout:'readonly',clearTimeout:'readonly',Plugin:'off'}},
    rules:{
      // The dependency-free build embeds these CommonJS modules verbatim.
      '@typescript-eslint/no-require-imports':'off',
      // A CodeMirror ViewPlugin class closes over the owning plugin instance.
      '@typescript-eslint/no-this-alias':'off',
      'no-implicit-globals':'off'
    }
  }
];
