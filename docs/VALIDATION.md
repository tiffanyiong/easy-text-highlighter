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

## Local follow-up — 1.0.1 (unreleased)

- 85 tests pass, including source-link generation from the final destination filename, localized source labels and Markdown-link preferences; clipboard content remains unchanged.
- Actual Obsidian export created `Welcome to Easy Text Highlighter - Highlights 2.md` with `Source: [[Welcome to Easy Text Highlighter]]`. Original-note backlink count changed from zero to one. Clicking the generated source link returned to the original note.
- Release metadata/build checks pass; official lint still has zero errors and 23 advisory warnings. Not pushed to GitHub or released.


## 1.1.0 PDF local preview — 2026-10-28

Not published. Public GitHub release remains 1.0.0. Installed in the dedicated Easy Text Highlighter Release QA vault only.

- 90 automated tests pass, including the existing Markdown behavior and PDF create/recolor/overlap isolation, multipage records, palette synchronization, sidebar grouping, and Markdown page links.
- Build and release checks pass; lint has zero errors and 23 existing warnings.
- Actual Obsidian 1.14.5: three PDF styles render correctly; a native PDF page-border offset discovered during visual inspection was fixed by measuring the overlay content box rather than the page border box. See `pdf-preview.jpg`.
- Actual sidebar navigation reaches page 2 and centers the passage without opening the annotation toolbar. See `pdf-jump.jpg`.
- Clicking the page-2 marked text opens the existing toolbar. Recolor to pink retains the same ID and one entry; Command Z restores yellow (slot-2), verified in persisted data.json.
- Native Create Markdown generated `PDF Highlighter QA - Highlights.md` with four excerpts and source links to pages 1 and 2. Original PDF SHA-256 before/after: `f93aec9492d0897ef2eacf9a5b95b94c548c511feb3164f4de0d6809c9df7e3d`.
- User confirmed that selecting new PDF text shows the toolbar. Automated native dragging was unreliable due to multi-monitor coordinates.
- Separate browser text-layer integration fixture verified new selection, annotation creation, one-character/click targeting, style change, recolor + undo, zoom geometry, reloading persisted records, and export links. This fixture is not presented as a native PDF screenshot.
- Physical mobile PDF and scanned/OCR files were not tested. This feature requires selectable PDF text; no OCR or embedded-PDF support is claimed.


## Mobile simulation — 2026-10-28 (unreleased)

- Actual Obsidian 1.14.5 official mobile emulation tested at 390×844 and 320×568 with Animal Island Cozy. This is desktop emulation, not a physical iPhone or Android test.
- PDF sidebar displays five saved records. Export initially selects all five; narrow export actions stack without clipping.
- Filter sheet fits both sizes, including five colors and equal-sized Reset/Confirm actions. Highlighter filter gives two matches; Reset restores all five and keeps the sheet open.
- Tapping a sidebar excerpt closes the mobile drawer and returns to PDF page 2 without opening the annotation toolbar.
- Separate responsive fixture verifies stacked export actions at 320 px, equal side-by-side actions at 390 px, filtering/reset, and dragging the sheet down to dismiss.
- Screenshot `mobile-filter-320.jpg` is cropped from actual Obsidian emulation. Native long-press text selection and iOS selection handles remain unverified.
- Restored desktop mode and disabled device emulation after testing. No production code changes or publication in this test session.

### Correction: desktop restoration
The initial desktop-restoration claim above was premature: the device viewport was off, but mobile/tablet body classes remained. Subsequently disabled official mobile emulation and verified body.className no longer contains emulate-mobile, is-mobile, or is-tablet; visually confirmed the desktop UI. No theme CSS changes. Publication remains paused.
