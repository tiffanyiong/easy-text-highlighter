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

## Formula / table selection regression — local only

- Reproduced before fix: strict visibleMap failed for rendered math in a callout and for quoted tables; ordinary two-column reading table mapping passed.
- Reviewed supplied Downloads/Pasted text.txt in an isolated pure-core VM. It repairs prose around math and quoted tables by excluding math, but formula-only selection still fails, PDF code is unchanged, and currency `$5 and $10` is incorrectly removed. Supplied data.json has zero records and was not installed.
- Local fix maps rendered math atomically to its full TeX source; preserves normal prose and currency. Quoted / single-column tables supported. Active table cell editors exclude their mirrored preview and measurement text.
- Regression tests added for prose in math/table callouts in both modes, atomic math offsets, currency/code, one-column formula tables, mirrored Live Preview cells and selectable PDF formula capture/save/reload. Fixed a pre-existing flaky PDF test that assumed a surviving merge ID rather than asserting its page/range content.
- Native Obsidian verified: callout prose selection and save in Live Preview; quoted table cell selection/save in Reading; inline math selection/save and display after mode switch; ordinary table cell selection/save in Live Preview; persisted marks after plugin reload; selectable PDF numerator TP saved and remains visible after reopening.
- Evidence: /tmp/easy-formula-editing-verified.jpg, /tmp/easy-formula-reading-verified.jpg, /tmp/easy-formula-pdf-reopened.jpg.
- PDF math without a selectable text layer (scanned/outlined graphics) remains outside text-highlighting support; no OCR added. Markdown math is highlighted as an entire rendered expression, not an individual TeX glyph.
- 100 tests pass; release check passes; lint has 0 errors and 23 existing advisories. No version bump, commit, push or publication. Wait for Tiffany's release approval.

## Images and mixed media selection — local regression fix

- Failing-before: wiki images (including size/alias), missing wiki images, reference images, quoted fences and nested media/table/math fixtures prevented whole-block mapping.
- Fix: ignore wiki/image references and actual image/embed/error UI in the prose map, support quoted fences and image references defined outside the rendered section. Preserve literal unresolved reference syntax when Live Preview displays it. Linked Markdown images and literal image-looking inline code are also covered.
- Mixed selection: selected prose before/after an embed is retained, error UI is excluded from excerpts. Editing quotes use filtered visible text to validate CodeMirror anchors. Image-only selection creates no empty text highlight.
- Excerpts trim leading/trailing UI whitespace and object replacement characters; existing records display without a media placeholder blank line, while internal paragraph breaks remain. Media selections trim the source anchor to the first/last actual text character.
- Native verified Reading: image-before and image-after callout prose, quote prose with image/math, quote table cell, reference image prose, quoted-code prose, nested bilingual/emoji prose, missing-image prose, and one range spanning broken image plus prose on both sides. Persisted mixed excerpt contains two text lines and no error message.
- Native verified Editing: callout prose after wiki image+math+table; reference-image widget prose opens the toolbar even when image syntax is rendered literally. Mode switches and plugin reload preserve marks. Mixed Editing quote/broken-image behavior is covered by regression tests; final extra live UI attempts were interrupted by application-state changes.
- 123 automated tests pass; release checks pass; lint 0 errors / 23 existing advisories. Source Markdown untouched by applying highlights. No commit, push, version bump or publication.

### Formula excerpt and line rendering (local, 2026-10-30)
- 126 tests pass. Sidebar uses Obsidian math rendering for Markdown TeX and retains selected color/style; PDF text is not reinterpreted as TeX.
- Native Reading and Editing verified with quote inline math: complete wave beneath the math box; sidebar renders superscripts. Live Preview math widgets use validated source positions.
- Build/release checks pass. No release performed.

### Formula/prose continuity follow-up (local, 2026-10-30)
- Native Reading, Live Preview and sidebar verified for background marker, solid underline and wavy underline on `Formula $x^2+y^2=z^2$.`. A single visual line is painted across the formula boundary.
- Live Preview keeps overlays inside math widgets, avoiding CodeMirror line reconciliation removing them. Resize observation refreshes wrapped line geometry.
- Regression test covers merging different prose/math heights into one visual mark while keeping wrapped lines separate. 127 tests pass; build/release checks pass, lint 0 errors/23 advisories.
- Local only; no publication.

### Display math and filename selection (local, 2026-10-30)
- Regression reproduced before fix: rendered display formula among other math did not open toolbar; editable filename incorrectly opened toolbar. Both now pass.
- Native Live Preview drag over rendered fraction opened toolbar without entering TeX. Saved full display-math range rendered in sidebar and persisted after plugin reload. Native Reading and Editing backgrounds hug MathJax content instead of display wrapper whitespace.
- Native filename selection in both modes showed no toolbar. Sidebar count/actions/divider remain, with top title/file header removed.
- 130 tests pass; build/release checks pass; no publication.


## 2026-10-30 — Unpublished reverse-selection and quote-code patch

- Fixed premature toolbar capture during a pointer drag. Selection capture waits for release; plugin section and formula overlay redraws are deferred during the drag.
- Fixed geometry measurement for a mark containing both prose and rendered math: text before/after the formula is included.
- Added a scoped Live Preview fallback for complete fenced code blocks in ordinary blockquotes. Source mode and native callouts retain their original renderer. Moving the editor cursor into the block reveals source; double-clicking the preview also opens source. Notes are not rewritten.
- Automated validation: 144 tests pass, including forward/backward three-formula callout capture in Source/Reading modes, delayed drag capture, mixed prose/math geometry, quote code preview/source transitions and source-offset mapping. Release reproducibility check and diff whitespace check pass. Lint: zero errors; advisories remain.
- Installed main.js/styles.css into the main vault and Release QA vault. Both data.json files verified unchanged. No version bump, GitHub push or release.
- Native Obsidian interaction is **not verified for this patch**: the user will reload and test later. In particular, repeat cold-open reverse dragging, check the complete saved quote and reopen it, then check code preview and source editing. Automated event/DOM mocks do not establish native race timing.
