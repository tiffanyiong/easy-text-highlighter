# Release notes

## 1.1.1 — 2026-10-30 · Bug fixes

- Fix selection and saved marks in callouts, quotes and tables containing math, images or missing-image placeholders, including nested callouts and Live Preview table cells.
- Allow selecting rendered display formulas in Live Preview without opening their TeX source. Render Markdown formulas in sidebar excerpts.
- Keep highlighter backgrounds, underlines and waves continuous across prose and formulas; fit display-math backgrounds to the formula and keep Obsidian’s edit control at the block’s top-right corner.
- Skip image/error UI when selecting mixed image-and-text passages, and remove leading/trailing placeholder blank lines from excerpts.
- Disable annotation toolbars on filename titles and remove per-highlight hover popups. Simplify the sidebar header to its count, actions and divider.
- Show yellow as Color 1 and teal as Color 2. New installations start with yellow (Color 1); existing saved color choices and annotations retain their colors.
- Fix build-time handling of dollar signs in bundled source.

### 中文

- 修正包含公式、圖片、失效圖片的提示框、引用、巢狀提示框與表格的選字和標記顯示問題，涵蓋 Reading 與 Editing／Live Preview。
- Live Preview 可直接選取排版好的區塊公式，不必先進入 TeX 原始碼；側欄摘錄支援公式排版。
- 修正文字與公式之間的馬克筆、直線及波浪線斷開；公式底色貼合內容，保留原本右上角的編輯按鈕位置。
- 圖片與文字混合選取會略過圖片及錯誤提示，摘錄不再帶入多餘首尾空行。
- 檔名不再顯示標記工具列；移除摘錄懸停提示框，簡化側欄上方標題與檔名，保留數量、按鈕及分隔線。
- 黃色與藍綠色交換顯示位置：黃色為 Color 1，藍綠色為 Color 2。全新安裝預設黃色，不覆蓋既有配色選擇或標記資料；修正建置時對美元符號的處理。

### Validation and known limits

- 131 automated behavior tests, reproducible build and release checks pass. Reported Markdown cases were checked in Obsidian 1.14.5 on macOS in Reading and Live Preview, including reload persistence and native edit-control placement.
- Obsidian’s ordinary blockquote/code-fence Live Preview parsing limitation remains upstream. Extra indentation before code fences is Markdown formatting and was corrected only in the local QA example.
- PDF files remain unchanged. Physical iOS/Android testing is still pending.

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
