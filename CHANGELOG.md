# Release notes

## 1.1.0 — 2026-10-28

- Highlight selectable text in the built-in PDF reader using the same three pens and five colors. PDF files remain unchanged.
- PDF excerpts appear in the current-document sidebar, grouped by page, with filters, selection export, recoloring, deletion, and annotation undo.
- Copy or create Markdown with links to every source page used by a passage. Marks are redrawn from PDF text anchors after zooming or reopening.
- PDF 劃線沿用三種筆和五色工具列，不修改 PDF；摘錄依頁碼整理，支援篩選、換色、刪除與復原，匯出附來源頁面連結。
- Requires a selectable text layer; no OCR or embedded-PDF support. Desktop PDF and mobile layouts were tested in Obsidian; physical iOS/Android long-press selection remains unverified.

### Also included (previously unreleased)

- Created Markdown notes include a localized source link back to the original note. Link generation follows Obsidian preferences and accounts for the destination path. Clipboard export is unchanged.
- 建立的 Markdown 筆記加入來源連結，可返回原筆記並形成反向連結。複製功能保持原樣。

## 1.0.0 — 2026-10-28

First public release of **Easy Text Highlighter**.

- Selection toolbar with highlighter, wavy underline, underline, and Copy.
- Five customizable palette colors shared by annotations, filters, and the sidebar.
- Click existing marks to recolor, change style, or remove them; overlapping marks merge without duplicate entries.
- Current-note sidebar organized by nearby headings, with navigation back to the original passage.
- Multi-select filters, Select All / Deselect All, clipboard export, and new Markdown notes.
- Theme-aware notifications, accent-colored button depth, and responsive export controls.
- English plus nine translated interfaces; Auto follows Obsidian.
- Separate annotation storage keeps the source Markdown unchanged.

### 中文

首個公開版本：選字劃線工具、五色自訂色盤、三種劃線樣式、依標題整理的摘錄側欄、篩選與勾選匯出、複製及建立 Markdown、十種介面語言與跟隨主題的樣式。標記獨立儲存，不修改原筆記。

Desktop verified on macOS / Obsidian 1.14.5. Physical mobile testing remains pending.
