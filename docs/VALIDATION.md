# Release validation — 1.0.0

Date: 2026-10-28. Tested with Obsidian 1.14.5 on macOS in a dedicated vault containing synthetic notes only.

## Automated

- **84 tests passed**: annotation anchors, Chinese/English/emoji text, edits and reloads, overlapping selections, duplicate prevention, palette migration, ten languages, filtering/export, undo ownership, sidebar navigation and viewport geometry.
- **Official Obsidian ESLint rules: 0 errors, 23 advisory warnings.** Remaining warnings concern window-specific timers, declarative settings/search integration, refreshing imperative settings, and CodeMirror development-dependency metadata. The config documents CommonJS-specific exceptions; no runtime safety rule is disabled.
- Build reproducibility: rebuilding `main.js` from committed source produces the same bytes.
- Release metadata and README image links checked with `npm run check`.
- Runtime imports are limited to Obsidian and CodeMirror; there are no network calls or Node.js-only runtime imports.

## Native Obsidian checks

- Enabled the actual 1.0.0 build in the release vault.
- Created a highlight from selected plain text, changed it to wave and underline, then removed it. The sidebar kept exactly one entry while changing styles.
- Clicked an existing callout highlight in Live Preview and opened its toolbar/palette.
- Recolored that passage: persisted data contained one record with the new color. Command Z restored its previous color and kept one record.
- Pasted text into an isolated test note, then Command Z removed the pasted text and restored the original line.
- Clicked sidebar excerpts in Reading View and Live Preview: the target was centered, and the annotation toolbar stayed closed. Scrolling naturally clamps near document boundaries.
- Combined a wave filter and purple color: one matching result. Confirm applied it; Reset restored all seven excerpts without closing the filter.
- Export opened in the sidebar with all seven checked. Deselect All cleared the checkboxes and disabled export actions; Select All restored them.
- Create Markdown saved a new note containing seven excerpts under their headings. A byte comparison confirmed the original note was unchanged.
- Inspected both Animal Island Cozy and the default Obsidian theme. The default Confirm button uses a darker purple shadow rather than a fixed green shadow.

## Responsive checks and limits

The local compiled-UI preview was checked at narrow widths, including 320px. Export actions stack in narrow sidebars; the filter has a bottom-sheet layout and a drag-to-dismiss handle.

Physical iOS/Android, Windows, popout windows, and every third-party theme have not been manually tested. Translations have dictionary/locale tests but have not all received native-speaker review. These are release limitations, not claims of verified device support.

## Reproduce

```sh
npm ci
npm test
npm run lint
npm run build
npm run check
```

Screenshots are actual Obsidian captures, not generated mockups. Animal Island Cozy is used for the main gallery; `default-overview.jpg` and `default-filter.jpg` show the default theme.
