/* Easy Text Highlighter. Built from plugin.js, core.js and i18n.js. */
const {LANGUAGES,TRANSLATIONS,locale}=(()=>{const module={exports:{}};
const LANGUAGES={"auto": "Auto", "en": "English", "zh": "繁體中文", "zh-CN": "简体中文", "ja": "日本語", "ko": "한국어", "es": "Español", "fr": "Français", "de": "Deutsch", "pt": "Português", "it": "Italiano"};
const TRANSLATIONS={
  "zh-CN": {
    "page": "页",
    "filterTitle": "筛选你的摘录",
    "swipeClose": "向下拖动关闭",
    "exportHighlights": "导出摘录",
    "markdownFile": "创建 Markdown",
    "selectAll": "全选",
    "selected": "项已选",
    "cancel": "取消",
    "selectExport": "选择要导出的摘录。",
    "exportFailed": "无法导出摘录，请重试。",
    "noteChanged": "笔记已切换，请重新选择摘录。",
    "created": "已生成 Markdown 文件",
    "filter": "筛选",
    "filterTypes": "划线类型",
    "filterColors": "颜色",
    "filterHint": "不选即显示全部。",
    "confirm": "确定",
    "reset": "重置",
    "matches": "条符合条件",
    "noMatches": "没有符合条件的摘录。",
    "copyHighlights": "复制摘录",
    "openNote": "打开笔记即可查看摘录。",
    "items": "条摘录",
    "copyFailed": "无法复制摘录，请重试。",
    "syncColors": "更改颜色会同步更新所有使用它的划线与侧栏摘录。",
    "styles": "样式",
    "title": "摘录",
    "mark": "划线",
    "remove": "删除划线",
    "copy": "复制",
    "close": "关闭",
    "custom": "自选颜色",
    "highlight": "荧光笔",
    "underline": "下划线",
    "wave": "波浪线",
    "current": "当前笔记",
    "all": "全部笔记",
    "empty": "选择笔记文字，再按划线。",
    "missing": "原文已变动，请手动查找。",
    "language": "语言",
    "defaultColor": "默认颜色",
    "defaultStyle": "默认样式",
    "width": "线条粗细",
    "opacity": "底色不透明度",
    "palette": "颜色 · 色盘",
    "swatches": "工具栏配色",
    "slot": "颜色",
    "height": "荧光底色高度",
    "scope": "显示范围",
    "unsupported": "请在阅读模式选择同一段落的文字，或使用编辑模式。",
    "overlapping": "此范围与其他标记重叠。",
    "saved": "摘录保存在此库的插件数据中，笔记原文不变。请连同 data.json 一起备份。",
    "copied": "已复制",
    "failed": "无法保存摘录，请保持插件启用并重试。",
    "export": "导出摘录",
    "deselectAll": "取消全选",
    "sourceNote": "来源"
  },
  "ja": {
    "page": "ページ",
    "filterTitle": "ハイライトを絞り込む",
    "swipeClose": "下にドラッグして閉じる",
    "exportHighlights": "ハイライトをエクスポート",
    "markdownFile": "Markdownを作成",
    "selectAll": "すべて選択",
    "selected": "件選択中",
    "cancel": "キャンセル",
    "selectExport": "エクスポートするハイライトを選択。",
    "exportFailed": "エクスポートできません。再試行してください。",
    "noteChanged": "ノートが変わりました。再選択してください。",
    "created": "Markdownファイルを作成しました",
    "filter": "フィルター",
    "filterTypes": "種類",
    "filterColors": "色",
    "filterHint": "未選択の場合はすべて表示。",
    "confirm": "適用",
    "reset": "リセット",
    "matches": "件一致",
    "noMatches": "一致するハイライトはありません。",
    "copyHighlights": "ハイライトをコピー",
    "openNote": "ノートを開くとハイライトが表示されます。",
    "items": "件のハイライト",
    "copyFailed": "コピーできません。再試行してください。",
    "syncColors": "色を変更すると、その色を使うすべてのハイライトとサイドバーも更新されます。",
    "styles": "スタイル",
    "title": "ハイライト",
    "mark": "マーク",
    "remove": "ハイライトを削除",
    "copy": "コピー",
    "close": "閉じる",
    "custom": "カスタム色",
    "highlight": "蛍光ペン",
    "underline": "下線",
    "wave": "波線",
    "current": "このノート",
    "all": "すべてのノート",
    "empty": "ノートの文字を選択してマークしてください。",
    "missing": "原文が変更されました。手動で探してください。",
    "language": "言語",
    "defaultColor": "既定の色",
    "defaultStyle": "既定のスタイル",
    "width": "線の太さ",
    "opacity": "背景の不透明度",
    "palette": "色・パレット",
    "swatches": "ツールバーの色",
    "slot": "色",
    "height": "ハイライトの高さ",
    "scope": "表示範囲",
    "unsupported": "閲覧モードでは同じ段落内を選択するか、編集モードを使ってください。",
    "overlapping": "選択範囲が他のハイライトと重なっています。",
    "saved": "ハイライトは保管庫のプラグインデータに保存され、ノート原文は変更されません。data.jsonも一緒にバックアップしてください。",
    "copied": "コピーしました",
    "failed": "保存できません。プラグインを有効にしたまま再試行してください。",
    "export": "ハイライトをエクスポート",
    "deselectAll": "すべて選択解除",
    "sourceNote": "出典"
  },
  "ko": {
    "page": "페이지",
    "filterTitle": "하이라이트 필터",
    "swipeClose": "아래로 끌어 닫기",
    "exportHighlights": "하이라이트 내보내기",
    "markdownFile": "Markdown 만들기",
    "selectAll": "모두 선택",
    "selected": "개 선택됨",
    "cancel": "취소",
    "selectExport": "내보낼 하이라이트를 선택하세요.",
    "exportFailed": "내보내지 못했습니다. 다시 시도하세요.",
    "noteChanged": "노트가 변경되었습니다. 다시 선택하세요.",
    "created": "Markdown 파일 생성됨",
    "filter": "필터",
    "filterTypes": "유형",
    "filterColors": "색상",
    "filterHint": "선택하지 않으면 모두 표시됩니다.",
    "confirm": "확인",
    "reset": "초기화",
    "matches": "개 일치",
    "noMatches": "일치하는 하이라이트가 없습니다.",
    "copyHighlights": "하이라이트 복사",
    "openNote": "노트를 열어 하이라이트를 확인하세요.",
    "items": "개 하이라이트",
    "copyFailed": "복사하지 못했습니다. 다시 시도하세요.",
    "syncColors": "색상을 변경하면 해당 색상의 모든 하이라이트와 사이드바가 함께 갱신됩니다.",
    "styles": "스타일",
    "title": "하이라이트",
    "mark": "표시",
    "remove": "하이라이트 삭제",
    "copy": "복사",
    "close": "닫기",
    "custom": "사용자 지정 색상",
    "highlight": "형광펜",
    "underline": "밑줄",
    "wave": "물결 밑줄",
    "current": "현재 노트",
    "all": "모든 노트",
    "empty": "노트의 텍스트를 선택한 뒤 표시하세요.",
    "missing": "원문이 변경되었습니다. 직접 찾아주세요.",
    "language": "언어",
    "defaultColor": "기본 색상",
    "defaultStyle": "기본 스타일",
    "width": "선 두께",
    "opacity": "배경 불투명도",
    "palette": "색상 · 팔레트",
    "swatches": "도구 모음 색상",
    "slot": "색상",
    "height": "하이라이트 높이",
    "scope": "표시 범위",
    "unsupported": "읽기 모드에서는 한 문단의 텍스트를 선택하거나 편집 모드를 사용하세요.",
    "overlapping": "선택 영역이 다른 하이라이트와 겹칩니다.",
    "saved": "하이라이트는 보관함의 플러그인 데이터에 저장되며 노트 원문은 변경되지 않습니다. data.json도 함께 백업하세요.",
    "copied": "복사됨",
    "failed": "저장하지 못했습니다. 플러그인을 활성화한 상태로 다시 시도하세요.",
    "export": "하이라이트 내보내기",
    "deselectAll": "모두 선택 해제",
    "sourceNote": "출처"
  },
  "es": {
    "page": "Página",
    "filterTitle": "Filtrar tus resaltados",
    "swipeClose": "Arrastra hacia abajo para cerrar",
    "exportHighlights": "Exportar resaltados",
    "markdownFile": "Crear Markdown",
    "selectAll": "Seleccionar todo",
    "selected": "seleccionados",
    "cancel": "Cancelar",
    "selectExport": "Selecciona los resaltados para exportar.",
    "exportFailed": "No se pudo exportar. Inténtalo de nuevo.",
    "noteChanged": "La nota cambió. Selecciona de nuevo.",
    "created": "Archivo Markdown creado",
    "filter": "Filtrar",
    "filterTypes": "Tipos",
    "filterColors": "Colores",
    "filterHint": "Sin selección se muestra todo.",
    "confirm": "Confirmar",
    "reset": "Restablecer",
    "matches": "resaltados coincidentes",
    "noMatches": "No hay resaltados coincidentes.",
    "copyHighlights": "Copiar resaltados",
    "openNote": "Abre una nota para ver sus resaltados.",
    "items": "resaltados",
    "copyFailed": "No se pudo copiar. Inténtalo de nuevo.",
    "syncColors": "Cambiar un color actualiza todos los resaltados que lo usan, incluida la barra lateral.",
    "styles": "Estilos",
    "title": "Resaltados",
    "mark": "Resaltar",
    "remove": "Eliminar resaltado",
    "copy": "Copiar",
    "close": "Cerrar",
    "custom": "Color personalizado",
    "highlight": "Resaltador",
    "underline": "Subrayado",
    "wave": "Subrayado ondulado",
    "current": "Esta nota",
    "all": "Todas las notas",
    "empty": "Selecciona texto en una nota y resáltalo.",
    "missing": "El texto original cambió. Búscalo manualmente.",
    "language": "Idioma",
    "defaultColor": "Color predeterminado",
    "defaultStyle": "Estilo predeterminado",
    "width": "Grosor de línea",
    "opacity": "Opacidad del fondo",
    "palette": "Colores · Paleta",
    "swatches": "Colores de la barra",
    "slot": "Color",
    "height": "Altura del resaltado",
    "scope": "Mostrar resaltados de",
    "unsupported": "Selecciona texto de un párrafo en lectura o usa el modo edición.",
    "overlapping": "La selección se superpone a otro resaltado.",
    "saved": "Los resaltados se guardan en los datos del complemento de esta bóveda. Las notas no cambian. Incluye data.json en tus copias de seguridad.",
    "copied": "Copiado",
    "failed": "No se pudo guardar. Mantén el complemento activado e inténtalo de nuevo.",
    "export": "Exportar resaltados",
    "deselectAll": "Deseleccionar todo",
    "sourceNote": "Fuente"
  },
  "fr": {
    "page": "Page",
    "filterTitle": "Filtrer vos surlignages",
    "swipeClose": "Glissez vers le bas pour fermer",
    "exportHighlights": "Exporter les surlignages",
    "markdownFile": "Créer Markdown",
    "selectAll": "Tout sélectionner",
    "selected": "sélectionnés",
    "cancel": "Annuler",
    "selectExport": "Sélectionnez les surlignages à exporter.",
    "exportFailed": "Échec de l’exportation. Réessayez.",
    "noteChanged": "La note a changé. Sélectionnez à nouveau.",
    "created": "Fichier Markdown créé",
    "filter": "Filtrer",
    "filterTypes": "Types",
    "filterColors": "Couleurs",
    "filterHint": "Sans sélection, tout est affiché.",
    "confirm": "Confirmer",
    "reset": "Réinitialiser",
    "matches": "surlignages correspondants",
    "noMatches": "Aucun surlignage correspondant.",
    "copyHighlights": "Copier les surlignages",
    "openNote": "Ouvrez une note pour voir ses surlignages.",
    "items": "surlignages",
    "copyFailed": "Échec de la copie. Réessayez.",
    "syncColors": "Changer une couleur met à jour tous les surlignages associés, y compris dans le panneau latéral.",
    "styles": "Styles",
    "title": "Surlignages",
    "mark": "Surligner",
    "remove": "Supprimer le surlignage",
    "copy": "Copier",
    "close": "Fermer",
    "custom": "Couleur personnalisée",
    "highlight": "Surligneur",
    "underline": "Soulignement",
    "wave": "Soulignement ondulé",
    "current": "Cette note",
    "all": "Toutes les notes",
    "empty": "Sélectionnez du texte dans une note, puis surlignez-le.",
    "missing": "Le texte original a changé. Retrouvez-le manuellement.",
    "language": "Langue",
    "defaultColor": "Couleur par défaut",
    "defaultStyle": "Style par défaut",
    "width": "Épaisseur du trait",
    "opacity": "Opacité du fond",
    "palette": "Couleurs · Palette",
    "swatches": "Couleurs de la barre d’outils",
    "slot": "Couleur",
    "height": "Hauteur du surlignage",
    "scope": "Afficher les surlignages de",
    "unsupported": "Sélectionnez du texte d’un paragraphe en lecture ou utilisez le mode édition.",
    "overlapping": "La sélection chevauche un autre surlignage.",
    "saved": "Les surlignages sont conservés dans les données du module de ce coffre. Les notes restent intactes. Sauvegardez aussi data.json.",
    "copied": "Copié",
    "failed": "Échec de l’enregistrement. Gardez le module activé et réessayez.",
    "export": "Exporter les surlignages",
    "deselectAll": "Tout désélectionner",
    "sourceNote": "Source"
  },
  "de": {
    "page": "Seite",
    "filterTitle": "Markierungen filtern",
    "swipeClose": "Zum Schließen nach unten ziehen",
    "exportHighlights": "Markierungen exportieren",
    "markdownFile": "Markdown erstellen",
    "selectAll": "Alles auswählen",
    "selected": "ausgewählt",
    "cancel": "Abbrechen",
    "selectExport": "Markierungen zum Exportieren auswählen.",
    "exportFailed": "Export fehlgeschlagen. Bitte erneut versuchen.",
    "noteChanged": "Notiz geändert. Bitte erneut auswählen.",
    "created": "Markdown-Datei erstellt",
    "filter": "Filter",
    "filterTypes": "Typen",
    "filterColors": "Farben",
    "filterHint": "Keine Auswahl zeigt alles.",
    "confirm": "Bestätigen",
    "reset": "Zurücksetzen",
    "matches": "passende Markierungen",
    "noMatches": "Keine passenden Markierungen.",
    "copyHighlights": "Markierungen kopieren",
    "openNote": "Eine Notiz öffnen, um Markierungen anzuzeigen.",
    "items": "Markierungen",
    "copyFailed": "Kopieren fehlgeschlagen. Bitte erneut versuchen.",
    "syncColors": "Eine Farbänderung aktualisiert alle zugehörigen Markierungen, auch in der Seitenleiste.",
    "styles": "Stile",
    "title": "Markierungen",
    "mark": "Markieren",
    "remove": "Markierung entfernen",
    "copy": "Kopieren",
    "close": "Schließen",
    "custom": "Eigene Farbe",
    "highlight": "Textmarker",
    "underline": "Unterstreichung",
    "wave": "Wellenlinie",
    "current": "Diese Notiz",
    "all": "Alle Notizen",
    "empty": "Text in einer Notiz auswählen und markieren.",
    "missing": "Originaltext geändert. Bitte manuell suchen.",
    "language": "Sprache",
    "defaultColor": "Standardfarbe",
    "defaultStyle": "Standardstil",
    "width": "Linienstärke",
    "opacity": "Hintergrunddeckkraft",
    "palette": "Farben · Palette",
    "swatches": "Werkzeugleistenfarben",
    "slot": "Farbe",
    "height": "Markierungshöhe",
    "scope": "Markierungen anzeigen aus",
    "unsupported": "Im Lesemodus Text eines Absatzes auswählen oder den Bearbeitungsmodus nutzen.",
    "overlapping": "Auswahl überlappt eine andere Markierung.",
    "saved": "Markierungen werden in den Plugin-Daten dieses Vaults gespeichert. Notizen bleiben unverändert. data.json mitsichern.",
    "copied": "Kopiert",
    "failed": "Speichern fehlgeschlagen. Plugin aktiviert lassen und erneut versuchen.",
    "export": "Markierungen exportieren",
    "deselectAll": "Alles abwählen",
    "sourceNote": "Quelle"
  },
  "pt": {
    "page": "Página",
    "filterTitle": "Filtrar destaques",
    "swipeClose": "Arraste para baixo para fechar",
    "exportHighlights": "Exportar destaques",
    "markdownFile": "Criar Markdown",
    "selectAll": "Selecionar tudo",
    "selected": "selecionados",
    "cancel": "Cancelar",
    "selectExport": "Selecione os destaques para exportar.",
    "exportFailed": "Não foi possível exportar. Tente novamente.",
    "noteChanged": "A nota mudou. Selecione novamente.",
    "created": "Arquivo Markdown criado",
    "filter": "Filtrar",
    "filterTypes": "Tipos",
    "filterColors": "Cores",
    "filterHint": "Sem seleção, mostrar tudo.",
    "confirm": "Confirmar",
    "reset": "Redefinir",
    "matches": "destaques correspondentes",
    "noMatches": "Nenhum destaque correspondente.",
    "copyHighlights": "Copiar destaques",
    "openNote": "Abra uma nota para ver os destaques.",
    "items": "destaques",
    "copyFailed": "Não foi possível copiar. Tente novamente.",
    "syncColors": "Alterar uma cor atualiza todos os destaques que a usam, inclusive na barra lateral.",
    "styles": "Estilos",
    "title": "Destaques",
    "mark": "Destacar",
    "remove": "Remover destaque",
    "copy": "Copiar",
    "close": "Fechar",
    "custom": "Cor personalizada",
    "highlight": "Marca-texto",
    "underline": "Sublinhado",
    "wave": "Sublinhado ondulado",
    "current": "Esta nota",
    "all": "Todas as notas",
    "empty": "Selecione texto em uma nota e destaque-o.",
    "missing": "O texto original mudou. Localize-o manualmente.",
    "language": "Idioma",
    "defaultColor": "Cor padrão",
    "defaultStyle": "Estilo padrão",
    "width": "Espessura da linha",
    "opacity": "Opacidade do fundo",
    "palette": "Cores · Paleta",
    "swatches": "Cores da barra de ferramentas",
    "slot": "Cor",
    "height": "Altura do destaque",
    "scope": "Mostrar destaques de",
    "unsupported": "Selecione texto de um parágrafo na leitura ou use o modo de edição.",
    "overlapping": "A seleção se sobrepõe a outro destaque.",
    "saved": "Os destaques ficam nos dados do plugin deste cofre. As notas não mudam. Inclua data.json no backup.",
    "copied": "Copiado",
    "failed": "Não foi possível salvar. Mantenha o plugin ativo e tente novamente.",
    "export": "Exportar destaques",
    "deselectAll": "Desmarcar tudo",
    "sourceNote": "Origem"
  },
  "it": {
    "page": "Pagina",
    "filterTitle": "Filtra evidenziazioni",
    "swipeClose": "Trascina in basso per chiudere",
    "exportHighlights": "Esporta evidenziazioni",
    "markdownFile": "Crea Markdown",
    "selectAll": "Seleziona tutto",
    "selected": "selezionati",
    "cancel": "Annulla",
    "selectExport": "Seleziona le evidenziazioni da esportare.",
    "exportFailed": "Esportazione non riuscita. Riprova.",
    "noteChanged": "La nota è cambiata. Seleziona di nuovo.",
    "created": "File Markdown creato",
    "filter": "Filtra",
    "filterTypes": "Tipi",
    "filterColors": "Colori",
    "filterHint": "Nessuna selezione mostra tutto.",
    "confirm": "Conferma",
    "reset": "Ripristina",
    "matches": "evidenziazioni corrispondenti",
    "noMatches": "Nessuna evidenziazione corrispondente.",
    "copyHighlights": "Copia evidenziazioni",
    "openNote": "Apri una nota per vedere le evidenziazioni.",
    "items": "evidenziazioni",
    "copyFailed": "Copia non riuscita. Riprova.",
    "syncColors": "Cambiare un colore aggiorna tutte le evidenziazioni associate, anche nella barra laterale.",
    "styles": "Stili",
    "title": "Evidenziazioni",
    "mark": "Evidenzia",
    "remove": "Rimuovi evidenziazione",
    "copy": "Copia",
    "close": "Chiudi",
    "custom": "Colore personalizzato",
    "highlight": "Evidenziatore",
    "underline": "Sottolineatura",
    "wave": "Sottolineatura ondulata",
    "current": "Questa nota",
    "all": "Tutte le note",
    "empty": "Seleziona del testo in una nota ed evidenzialo.",
    "missing": "Il testo originale è cambiato. Cercalo manualmente.",
    "language": "Lingua",
    "defaultColor": "Colore predefinito",
    "defaultStyle": "Stile predefinito",
    "width": "Spessore della linea",
    "opacity": "Opacità dello sfondo",
    "palette": "Colori · Tavolozza",
    "swatches": "Colori della barra strumenti",
    "slot": "Colore",
    "height": "Altezza dell’evidenziazione",
    "scope": "Mostra evidenziazioni di",
    "unsupported": "Seleziona testo di un paragrafo in lettura o usa la modalità modifica.",
    "overlapping": "La selezione si sovrappone a un’altra evidenziazione.",
    "saved": "Le evidenziazioni sono salvate nei dati del plugin di questo vault. Le note restano invariate. Includi data.json nel backup.",
    "copied": "Copiato",
    "failed": "Salvataggio non riuscito. Mantieni il plugin attivo e riprova.",
    "export": "Esporta evidenziazioni",
    "deselectAll": "Deseleziona tutto",
    "sourceNote": "Fonte"
  }
};
function locale(raw){
 const code=String(raw||'en').replace(/_/g,'-').toLowerCase();
 if(code==='zh'||code.startsWith('zh-tw')||code.startsWith('zh-hk')||code.startsWith('zh-mo')||code.startsWith('zh-hant'))return 'zh';
 if(code.startsWith('zh'))return 'zh-CN';
 const base=code.split('-')[0];return Object.hasOwn(LANGUAGES,base)?base:'en';
}
module.exports={LANGUAGES,TRANSLATIONS,locale};

return module.exports;})();
const {Plugin,ItemView,Modal,PluginSettingTab,Setting,MarkdownView,MarkdownRenderChild,Notice,editorInfoField,getLanguage}=require('obsidian');
const {ViewPlugin,Decoration}=require('@codemirror/view');
const {StateEffect}=require('@codemirror/state');
const {PALETTE,anchor,resolve,place,rgba,upsert,segments,selectedMark,projectMarkdown,visibleMap,migrateData,slotHex,paletteSide,highlightOutline,outlineMarkdown,matchesHighlightFilter,badgeInk,flatHighlightGroups,softStyleBadge,dismissSheet,editorSelectionBounds}=(()=>{const module={exports:{}};
/* Pure annotation and viewport logic; shared by plugin and behavior tests. */
const LEGACY_PALETTE = [
 ['green','Green','綠色','#20c933'],['pink','Pink','粉紅','#f7a3b3'],
 ['purple','Purple','紫色','#b77aeb'],['blue','Blue','藍色','#8899ef'],
 ['yellow','Yellow','黃色','#f6cf64'],['orange','Orange','橙色','#e99161'],
 ['mint','Mint','薄荷','#7fd4bc'],['sage','Sage','鼠尾草綠','#8bc88c'],
 ['red','Red','紅色','#ff6d70'],['lime','Lime','萊姆綠','#cbdc4d'],
 ['lemon','Yellow green','黃綠','#ece34b'],['brown','Brown','棕色','#9c865a'],
 ['peach','Peach','蜜桃','#e58b75'],['parchment','Parchment','羊皮紙','#e8dcc0']
].map(([id,en,zh,hex])=>({id,en,zh,hex}));
const PALETTE=[
 ['slot-5','Color 1','顏色 1','#a9eae2'],
 ['slot-2','Color 2','顏色 2','#fdf85d'],
 ['slot-1','Color 3','顏色 3','#91f476'],
 ['slot-3','Color 4','顏色 4','#f7a3b3'],
 ['slot-4','Color 5','顏色 5','#ceaef4']
].map(([id,en,zh,hex])=>({id,en,zh,hex}));
const DEFAULTS={language:'auto',color:'slot-2',style:'highlight',height:2,width:2,opacity:.3,colors:Object.fromEntries(PALETTE.map(c=>[c.id,c.hex]))};
const validHex=x=>typeof x==='string'&&/^#[\da-f]{6}$/i.test(x);
function settings(raw={}) {
 const n=(x,min,max,d)=>Number.isFinite(x)?Math.max(min,Math.min(max,x)):d;
 const oldQuick=raw.quickColors||['green','lemon','pink','purple','blue'];
 const colors=Object.fromEntries(PALETTE.map((c,i)=>{
  const oldId=oldQuick[Number(c.id.slice(-1))-1],oldDefault=LEGACY_PALETTE.find(x=>x.id===oldId)?.hex,old=raw.colors?.[oldId];
  // Preserve deliberate custom colors; refresh the old factory palette to softer defaults.
  return [c.id,validHex(raw.colors?.[c.id])?raw.colors[c.id]:(validHex(old)&&old!==oldDefault?old:c.hex)];
 }));
 return {language:['auto','en','zh','zh-CN','ja','ko','es','fr','de','pt','it'].includes(raw.language)?raw.language:'auto',color:PALETTE.some(c=>c.id===raw.color)?raw.color:legacySlot(raw.color,raw,colors),style:['highlight','underline','wave'].includes(raw.style)?raw.style:'highlight',height:n(raw.height,0,5,2),width:n(raw.width,1,5,2),opacity:n(raw.opacity,.1,.7,.3),colors};
}
function legacySlot(color,raw={},colors=DEFAULTS.colors,hex){
 if(PALETTE.some(c=>c.id===color))return color;
 const quick=raw.quickColors||['green','lemon','pink','purple','blue'];const index=quick.indexOf(color);if(index>=0&&index<5)return 'slot-'+(index+1);
 if(['green','sage','lime','mint'].includes(color))return 'slot-1';
 if(['yellow','lemon','orange'].includes(color))return 'slot-2';
 if(['pink','peach','red'].includes(color))return 'slot-3';
 if(color==='purple')return 'slot-4';if(color==='blue')return 'slot-5';
 const target=hex||raw.colors?.[color]||raw.customColor;if(!validHex(target))return 'slot-2';
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),v=rgb(target);
 return PALETTE.map(c=>({id:c.id,d:rgb(colors[c.id]).reduce((n,x,i)=>n+(x-v[i])**2,0)})).sort((a,b)=>a.d-b.d)[0].id;
}
function migrateData(data={}){
 const next=settings(data.settings);const records=(Array.isArray(data.records)?data.records:[]).map(r=>{
  const migrated={...r,color:legacySlot(r.color,data.settings||{},next.colors,r.hex)};delete migrated.hex;return migrated;
 });return {schema:2,settings:next,records};
}
function slotHex(record,config){return config.colors[record?.color]||config.colors['slot-2'];}
function anchor(text,from,to) {return {from,to,quote:text.slice(from,to),before:text.slice(Math.max(0,from-40),from),after:text.slice(to,to+40)};}
function occurrences(text,quote) {const out=[]; if(!quote)return out; let i=0; while((i=text.indexOf(quote,i))!==-1){out.push(i);i+=quote.length;}return out;}
function resolve(record,text) {
 const hits=occurrences(text,record.quote); if(hits.length===1)return {from:hits[0],to:hits[0]+record.quote.length};
 const contextual=hits.filter(i=>(!record.before||text.slice(Math.max(0,i-record.before.length),i)===record.before)&&(!record.after||text.slice(i+record.quote.length,i+record.quote.length+record.after.length)===record.after));
 return contextual.length===1?{from:contextual[0],to:contextual[0]+record.quote.length}:null;
}
function place(rect,size,vp) {
 const margin=8, gap=10, width=Math.min(size.width,Math.max(0,vp.width-16)),height=Math.min(size.height,Math.max(0,vp.height-16));
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const x=clamp((rect.left+rect.right-width)/2,vp.left+margin,vp.left+vp.width-width-margin);
 const above=rect.top-gap-height;
 const y=above>=vp.top+margin?above:clamp(rect.bottom+gap,vp.top+margin,vp.top+vp.height-height-margin);
 return {left:x,top:y,maxWidth:Math.max(0,vp.width-16),maxHeight:Math.max(0,vp.height-16)};
}
function rgba(hex,alpha){return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${alpha})`;}
module.exports={PALETTE,DEFAULTS,settings,anchor,occurrences,resolve,place,rgba,migrateData,slotHex};

// Full containment replaces covered marks; partial intersections remain independent.
function upsert(records,pending,text,change,defaults,id,now=Date.now()) {
 const p=resolve(pending,text);if(!p)return null;
 const positioned=records.map(r=>({r,p:r.path===pending.path?resolve(r,text):null}));
 let from=p.from,to=p.to;const covered=[];let grew;
 do{grew=false;for(const x of positioned){if(!x.p||covered.includes(x)||x.p.from>=to||x.p.to<=from)continue;covered.push(x);from=Math.min(from,x.p.from);to=Math.max(to,x.p.to);grew=true;}}while(grew);
 const base=covered.slice().sort((a,b)=>(b.r.updated||b.r.created||0)-(a.r.updated||a.r.created||0))[0]?.r;
 const record={...(base||{id,created:now,color:defaults.color,style:defaults.style}),path:pending.path,...anchor(text,from,to),...change,updated:now};
 if(pending.display&&from===p.from&&to===p.to)record.display=pending.display;else delete record.display;
 const removed=new Set(covered.map(x=>x.r.id));
 return {record,records:[...records.filter(r=>!removed.has(r.id)),record]};
}
// Paint each overlap once. Latest mark wins visually, while all partial records survive.
function segments(ranges) {
 const edges=[...new Set(ranges.flatMap(x=>[x.from,x.to]))].sort((a,b)=>a-b),out=[];
 for(let i=0;i<edges.length-1;i++){
  const from=edges[i],to=edges[i+1];const active=ranges.filter(x=>x.from<=from&&x.to>=to);
  if(!active.length)continue;active.sort((a,b)=>(a.r.updated||a.r.created||0)-(b.r.updated||b.r.created||0));const r=active[active.length-1].r;
  if(out.length&&out[out.length-1].r.id===r.id&&out[out.length-1].to===from)out[out.length-1].to=to;else out.push({from,to,r});
 }
 return out;
}
module.exports.upsert=upsert;module.exports.segments=segments;

// A single selected character is sufficient to address the entire visible mark.
function selectedMark(records,pending,text) {
 return records.map((r,index)=>({r,index,p:r.path===pending.path?resolve(r,text):null}))
  .filter(x=>x.p&&x.p.from<pending.to&&x.p.to>pending.from)
  .sort((a,b)=>(b.r.updated||b.r.created||0)-(a.r.updated||a.r.created||0)||b.index-a.index)[0]?.r;
}
module.exports.selectedMark=selectedMark;

// Visible Markdown projection with source offsets; markup stays untouched in notes.
function projectMarkdown(source) {
 const chars=[],offsets=[];let tableMode=false;const emit=(s,from,to)=>{for(const ch of s){for(let j=0;j<ch.length;j++){chars.push(ch[j]);offsets.push({from,to});}}};
 const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
 function inline(start,end){let i=start;
  while(i<end){
   if(source[i]==='\\'&&i+1<end){emit(source[i+1],i,i+2);i+=2;continue;}
   if(source[i]==='`'){const m=source.slice(i,end).match(/^`+/)[0],close=source.indexOf(m,i+m.length);if(close>=0&&close<end){for(let k=i+m.length;k<close;k++)emit(source[k],k,k+1);i=close+m.length;continue;}}
   if(source.startsWith('[[',i)){const close=source.indexOf(']]',i+2);if(close>=0&&close<end){const pipe=source.lastIndexOf('|',close);const label=pipe>=i+2?pipe+1:i+2;inline(label,close);i=close+2;continue;}}
   if(source[i]==='['||source.startsWith('![',i)){const image=source[i]==='!',open=i+(image?1:0),close=source.indexOf(']',open+1);if(close>=0&&close<end&&source[close+1]==='('){let k=close+2,depth=1;for(;k<end&&depth;k++){if(source[k]==='(')depth++;if(source[k]===')')depth--;}
     if(!depth){if(!image)inline(open+1,close);i=k;continue;}}}
   if(source.startsWith('<!--',i)){const close=source.indexOf('-->',i+4);if(close>=0){i=close+3;continue;}}
   if(source[i]==='<'){const close=source.indexOf('>',i+1);if(close>=0&&close<end){const tag=source.slice(i+1,close);if(/^https?:\/\//.test(tag)||/^[^ <>]+@[^ <>]+$/.test(tag))inline(i+1,close);i=close+1;continue;}}
   if(source[i]==='&'){const m=source.slice(i,end).match(/^&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/i);if(m){const key=m[1];let decoded=entities[key.toLowerCase()];if(key[0]==='#'){const num=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);if(num<=0x10ffff)decoded=String.fromCodePoint(num);}if(decoded){emit(decoded,i,i+m[0].length);i+=m[0].length;continue;}}}
   const delimiter=source.slice(i,end).match(/^(\*{1,3}|_{1,3}|~~|==)/)?.[0];
   if(delimiter){const close=source.indexOf(delimiter,i+delimiter.length);if(close>=0&&close<end){inline(i+delimiter.length,close);i=close+delimiter.length;continue;}}
   if(tableMode&&source[i]==='|'){i++;continue;}
   emit(source[i],i,i+1);i++;
  }
 }
 let cursor=0,fence=null,frontmatter=source.startsWith('---\n');
 const lines=source.split('\n');const tables=new Set();
 for(let row=1;row<lines.length;row++)if(/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[row])){tables.add(row-1);tables.add(row);for(let k=row+1;k<lines.length&&lines[k].includes('|');k++)tables.add(k);}
 let row=-1;for(const line of lines){row++;tableMode=tables.has(row);
  const end=cursor+line.length;
  if(frontmatter){if(cursor>0&&/^---\s*$/.test(line))frontmatter=false;cursor=end+1;continue;}
  const fm=line.match(/^\s*(`{3,}|~{3,})/);if(fm){fence=fence?null:fm[1];cursor=end+1;continue;}
  if(tableMode&&/^\s*[| :-]+$/.test(line)){cursor=end+1;continue;}
  const prefix=fence?0:(line.match(/^\s*(?:(?:>\s*)+)?(?:(?:#{1,6}\s+)|(?:[-+*]\s+(?:\[[^\]]\]\s+)?)|(?:\d+[.)]\s+))?/)?.[0].length||0);
  if(fence){for(let i=cursor;i<end;i++)emit(source[i],i,i+1);}else {const callout=source.slice(cursor+prefix,end).match(/^\[![^\]]+\][+-]?\s*/)?.[0].length||0;inline(cursor+prefix+callout,end);}
  emit('\n',end,Math.min(end+1,source.length));cursor=end+1;
 }
 if(chars.at(-1)==='\n'&&!source.endsWith('\n')){chars.pop();offsets.pop();}
 return {text:chars.join(''),offsets};
}
function visibleMap(source,visible,base=0) {
 const projected=projectMarkdown(source);const compact=(text)=>{let value='',indices=[];for(let i=0;i<text.length;i++)if(!/[\s\u200b\ufeff]/.test(text[i])){value+=text[i];indices.push(i);}return {value,indices};};
 const a=compact(projected.text),b=compact(visible);if(!b.value)return null;const hits=occurrences(a.value,b.value);if(hits.length!==1)return null;
 const map=Array(visible.length).fill(null);for(let j=0;j<b.indices.length;j++){const p=projected.offsets[a.indices[hits[0]+j]];map[b.indices[j]]={from:base+p.from,to:base+p.to};}return map;
}
module.exports.projectMarkdown=projectMarkdown;module.exports.visibleMap=visibleMap;

function paletteSide(rect,toolbar,palette,vp,gap=6){
 const bar=place(rect,toolbar,vp);
 return bar.top-palette.height-gap>=vp.top+8?'above':'below';
}
module.exports.paletteSide=paletteSide;

// Markdown heading hierarchy for the current-note highlights panel.
function highlightOutline(source,records,path){
 const root={id:'root',level:0,title:'',items:[],children:[],count:0};const stack=[root],headings=[];let offset=0,fence=null,frontmatter=source.startsWith('---\n')||source.startsWith('---\r\n');const lines=source.split('\n');
 for(let i=0;i<lines.length;i++){
  const line=lines[i].replace(/\r$/,'');let title,level;
  if(frontmatter){if(i>0&&/^(---|\.\.\.)\s*$/.test(line))frontmatter=false;offset+=lines[i].length+1;continue;}
  const f=line.match(/^ {0,3}(`{3,}|~{3,})/);if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&/^ {0,3}(`+|~+)\s*$/.test(line))fence=null;offset+=lines[i].length+1;continue;}
  if(!fence){const atx=line.match(/^ {0,3}(#{1,6})(?:[ \t]+|$)(.*)$/);if(atx){level=atx[1].length;title=atx[2].replace(/[ \t]+#+[ \t]*$/,'').trim();}
   else if(line.trim()&&!/^\s*(>|[-*+]\s|\d+[.)]\s)/.test(line)&&/^ {0,3}(=+|-+)\s*$/.test(lines[i+1]||'')){level=lines[i+1].trim()[0]==='='?1:2;title=line.trim();}
  }
  if(level){const h={id:offset+':'+level,from:offset,level,title:projectMarkdown(title).text,items:[],children:[],count:0};while(stack.length>1&&stack[stack.length-1].level>=level)stack.pop();stack[stack.length-1].children.push(h);stack.push(h);headings.push(h);}
  offset+=lines[i].length+1;
 }
 const sorted=records.filter(r=>r.path===path).map(r=>({r,p:resolve(r,source)})).sort((a,b)=>(a.p?.from??a.r.from)-(b.p?.from??b.r.from));
 for(const {r,p} of sorted){const node=p?headings.filter(h=>h.from<=p.from).at(-1)||root:root;node.items.push(r);}
 function prune(node){node.children=node.children.filter(child=>prune(child));node.count=node.items.length+node.children.reduce((n,c)=>n+c.count,0);return node.count>0;}prune(root);return root;
}
function outlineMarkdown(tree,title,excerpt){
 const out=['# '+title];function walk(node){if(node.level)out.push('#'.repeat(Math.min(6,node.level+1))+' '+node.title);for(const r of node.items)out.push(excerpt(r).split('\n').map(line=>'> '+line).join('\n'));for(const child of node.children)walk(child);}walk(tree);return out.join('\n\n')+'\n';
}
module.exports.highlightOutline=highlightOutline;module.exports.outlineMarkdown=outlineMarkdown;

// Empty dimensions mean unrestricted; selections OR within a dimension, AND across them.
function matchesHighlightFilter(record,filter={}){
 return (!filter.types?.length||filter.types.includes(record.style))&&(!filter.colors?.length||filter.colors.includes(record.color));
}
module.exports.matchesHighlightFilter=matchesHighlightFilter;
function badgeInk(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.35?'#453824':'#fff8ed';}
module.exports.badgeInk=badgeInk;
function flatHighlightGroups(tree){const out=[];function walk(node){if(node.items.length)out.push({id:node.id,title:node.title,items:node.items});for(const child of node.children)walk(child);}walk(tree);return out;}
function softStyleBadge(hex){const blend=(base,ratio)=>'#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*ratio+parseInt(base.slice(i,i+2),16)*(1-ratio)).toString(16).padStart(2,'0')).join('');return {background:blend('#ede9df',.22),ink:blend('#4e493f',.18)};}
module.exports.flatHighlightGroups=flatHighlightGroups;module.exports.softStyleBadge=softStyleBadge;
function dismissSheet(distance,duration,height){return distance>=Math.min(120,height*.22)||(distance>28&&distance/Math.max(1,duration)>.65);}
module.exports.dismissSheet=dismissSheet;

// Validate editor offsets against the actual DOM selection before saving an anchor.
// Live Preview can reveal Markdown prefixes while a mouse selection is in progress.
function editorSelectionBounds(source,selected,candidates){
 const compact=s=>s.replace(/[\s\u200b\ufeff]/g,'');const wanted=compact(selected),visible=projectMarkdown(selected).text,wantedVisible=compact(visible);if(!wanted)return null;
 const valid=candidates.filter(p=>Number.isInteger(p.from)&&Number.isInteger(p.to)&&p.from>=0&&p.to>=p.from&&p.to<=source.length);
 for(const p of valid){if(p.to===p.from)continue;const raw=source.slice(p.from,p.to);if(compact(raw)===wanted||(wantedVisible&&compact(projectMarkdown(raw).text)===wantedVisible))return p;}
 for(const p of valid){const start=source.lastIndexOf('\n',Math.max(-1,p.from-1))+1;const endAt=source.indexOf('\n',p.to);const end=endAt<0?source.length:endAt;const scope=source.slice(start,end);const exact=occurrences(scope,selected);
  if(exact.length===1)return {from:start+exact[0],to:start+exact[0]+selected.length};
  const map=visibleMap(scope,visible,start);if(map){const offsets=map.filter(Boolean);if(offsets.length)return {from:Math.min(...offsets.map(x=>x.from)),to:Math.max(...offsets.map(x=>x.to))};}
 }
 return null;
}
module.exports.editorSelectionBounds=editorSelectionBounds;

return module.exports;})();
const {PdfSupport,pdfPartsValid,pdfContains,pdfSelected,pdfTree,pdfUpsert}=(()=>{const module={exports:{}};
// PDF annotations live only in plugin data. PDF bytes and text-layer nodes stay untouched.

function pdfPartsValid(parts){return Array.isArray(parts)&&parts.length>0&&parts.every(p=>Number.isInteger(p.page)&&p.page>0&&Number.isInteger(p.from)&&Number.isInteger(p.to)&&p.from>=0&&p.to>p.from&&typeof p.quote==='string'&&p.quote.length>0);}
function pdfContains(record,pending){return pending.parts.every(p=>record.parts.some(r=>r.page===p.page&&r.from<=p.from&&r.to>=p.to));}
function pdfIntersects(a,b){return a.parts.some(p=>b.parts.some(q=>p.page===q.page&&p.from<q.to&&p.to>q.from));}
function pdfSelected(records,pending){return records.filter(r=>r.kind==='pdf'&&r.path===pending.path&&pdfIntersects(r,pending)).sort((a,b)=>(b.updated||0)-(a.updated||0))[0];}
function pdfTree(records,pageLabel){const pages=new Map();for(const r of records){const page=r.parts[0].page;if(!pages.has(page))pages.set(page,[]);pages.get(page).push(r);}return {id:'root',level:0,title:'',items:[],count:records.length,children:[...pages].sort(([a],[b])=>a-b).map(([page,items])=>({id:'pdf:'+page,level:1,title:pageLabel+' '+page,items:items.sort((a,b)=>a.parts[0].from-b.parts[0].from),children:[],count:items.length}))};}
function pdfUpsert(records,pending,texts,change,defaults,id,now=Date.now()){
 let parts=pending.parts.map(p=>({...p}));const covered=[];let grew;
 do{grew=false;for(const r of records){if(r.kind!=='pdf'||r.path!==pending.path||covered.includes(r)||!pdfIntersects({parts},r))continue;covered.push(r);parts.push(...r.parts);grew=true;}}while(grew);
 const pages=[...new Set(parts.map(p=>p.page))].sort((a,b)=>a-b),merged=[];
 for(const page of pages){const text=texts.get(page);if(typeof text!=='string'){if(pending.id&&covered.some(r=>r.id===pending.id)){merged.push(...parts.filter(p=>p.page===page).filter((p,i,a)=>a.findIndex(q=>q.from===p.from&&q.to===p.to)===i));continue;}if(!pending.parts.some(p=>p.page===page)){merged.push(...parts.filter(p=>p.page===page));continue;}return null;}const ranges=parts.filter(p=>p.page===page).map(p=>resolve(p,text));if(ranges.some(p=>!p))return null;ranges.sort((a,b)=>a.from-b.from);const unions=[];for(const p of ranges){const last=unions.at(-1);if(last&&p.from<=last.to)last.to=Math.max(last.to,p.to);else unions.push({...p});}for(const p of unions)merged.push({page,...anchor(text,p.from,p.to)});}
 const base=covered.sort((a,b)=>(b.updated||0)-(a.updated||0))[0];const quote=merged.map(p=>p.quote).join('\n');
 const record={...(base||{id,created:now,color:defaults.color,style:defaults.style}),kind:'pdf',path:pending.path,parts:merged,from:0,to:quote.length,quote,display:quote,...change,updated:now};
 return {record,records:[...records.filter(r=>!covered.includes(r)),record]};
}
function pageText(page){const layer=page.querySelector('.textLayer');if(!layer)return null;const doc=page.ownerDocument,walker=doc.createTreeWalker(layer,5),nodes=[];let text='',n;while((n=walker.nextNode())){if(n.nodeType===1){if(n.tagName==='BR')text+='\n';continue;}if(!n.textContent||n.parentElement.closest('.endOfContent'))continue;nodes.push({node:n,from:text.length,to:text.length+n.textContent.length});text+=n.textContent;}return {layer,nodes,text};}
function rangeRects(page,model,from,to){const rects=[],doc=page.ownerDocument;for(const n of model.nodes){const a=Math.max(from,n.from),b=Math.min(to,n.to);if(a>=b)continue;const range=doc.createRange();range.setStart(n.node,a-n.from);range.setEnd(n.node,b-n.from);for(const r of range.getClientRects())if(r.width>.1&&r.height>.1)rects.push(r);}return rects;}
function pdfCapture(view,range){const parts=[],texts=new Map();for(const page of view.contentEl.querySelectorAll('.page[data-page-number]')){if(!range.intersectsNode(page))continue;const number=Number(page.dataset.pageNumber),model=pageText(page);if(!model?.text||!Number.isInteger(number)||number<1)continue;let from=Infinity,to=-Infinity;for(const n of model.nodes){if(!range.intersectsNode(n.node))continue;const a=range.startContainer===n.node?range.startOffset:0,b=range.endContainer===n.node?range.endOffset:n.node.length;if(b>a){from=Math.min(from,n.from+a);to=Math.max(to,n.from+b);}}if(Number.isFinite(from)&&model.text.slice(from,to).trim()){parts.push({page:number,...anchor(model.text,from,to)});texts.set(number,model.text);}}if(!parts.length)return null;parts.sort((a,b)=>a.page-b.page||a.from-b.from);const quote=parts.map(p=>p.quote).join('\n');return {pending:{kind:'pdf',path:view.file.path,parts,from:0,to:quote.length,quote,display:quote},texts};}
class PdfSupport{
 constructor(plugin){this.plugin=plugin;this.frames=[];this.timer=null;const doc=plugin.doc;const Observer=doc.defaultView.MutationObserver;if(Observer){this.observer=new Observer(changes=>{if(changes.some(c=>!c.target.closest?.('.aih-pdf-overlay')&&((c.type==='attributes'&&c.target.closest?.('.pdf-viewer-container'))||[...c.addedNodes,...c.removedNodes].some(n=>n.nodeType===1&&(n.matches?.('.page,.textLayer,.textLayerNode')||n.querySelector?.('.textLayer'))))))this.schedule();});this.observer.observe(plugin.app.workspace.containerEl,{childList:true,subtree:true,attributes:true,attributeFilter:['style','data-loaded']});}const Resize=doc.defaultView.ResizeObserver;if(Resize){this.resizeObserver=new Resize(()=>this.schedule());this.resizeObserver.observe(plugin.app.workspace.containerEl);}this.schedule();}
 schedule(){this.plugin.doc.defaultView.clearTimeout?.(this.timer);this.timer=(this.plugin.doc.defaultView.setTimeout||setTimeout)(()=>this.render(),70);}
 views(){return this.plugin.app.workspace.getLeavesOfType('pdf').map(l=>l.view).filter(v=>v.file?.extension==='pdf');}
 capture(range){const view=this.views().find(v=>v.contentEl.contains(range.commonAncestorContainer));return view&&pdfCapture(view,range);}
 render(){const p=this.plugin;if(p.unloading)return;let relocated=false;this.frames=[];for(const view of this.views())for(const page of view.contentEl.querySelectorAll('.page[data-page-number]')){const model=pageText(page);if(!model?.text)continue;const number=Number(page.dataset.pageNumber),pageBounds=page.getBoundingClientRect();if(!pageBounds.width||!pageBounds.height)continue;page.querySelector('.aih-pdf-overlay')?.remove();const overlay=page.ownerDocument.createElement('div');overlay.className='aih-pdf-overlay';overlay.setAttribute('aria-hidden','true');page.append(overlay);const bounds=overlay.getBoundingClientRect();
  for(const record of p.records.filter(r=>r.kind==='pdf'&&r.path===view.file.path))for(const part of record.parts.filter(x=>x.page===number)){const resolved=resolve(part,model.text);if(!resolved)continue;if(part.from!==resolved.from||part.to!==resolved.to){Object.assign(part,anchor(model.text,resolved.from,resolved.to));relocated=true;}for(const rect of rangeRects(page,model,resolved.from,resolved.to)){const el=page.ownerDocument.createElement('span');el.className='aih-pdf-mark aih-pdf-'+record.style;el.dataset.aihId=record.id;el.setAttribute('style',p.markStyle(record));Object.assign(el.style,{left:(rect.left-bounds.left)/bounds.width*100+'%',top:(rect.top-bounds.top)/bounds.height*100+'%',width:rect.width/bounds.width*100+'%',height:rect.height/bounds.height*100+'%'});if(record.style==='wave'){const ns='http://www.w3.org/2000/svg',svg=page.ownerDocument.createElementNS(ns,'svg'),path=page.ownerDocument.createElementNS(ns,'path');svg.setAttribute('viewBox',`0 0 ${rect.width} 6`);svg.setAttribute('preserveAspectRatio','none');let d='M0 3';for(let x=0;x<rect.width;x+=8)d+=`q2 -3 4 0t4 0`;path.setAttribute('d',d);svg.append(path);el.append(svg);}overlay.append(el);this.frames.push({el,record,page});}}
 }if(relocated)p.scheduleSave();}
 hit(event){for(const f of this.frames){if(!f.el.isConnected)continue;const r=f.el.getBoundingClientRect();if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom&&f.page.contains(event.target))return {id:f.record.id,rect:r,x:event.clientX,y:event.clientY};}return null;}
 texts(pending){const texts=new Map();for(const view of this.views().filter(v=>v.file.path===pending.path))for(const page of view.contentEl.querySelectorAll('.page[data-page-number]')){const model=pageText(page);if(model?.text)texts.set(Number(page.dataset.pageNumber),model.text);}return texts;}
 async jump(view,record,navigation){const p=this.plugin,pageNumber=record.parts[0].page;view.setEphemeralState?.({subpath:'#page='+pageNumber});for(let i=0;i<16;i++){await new Promise(done=>(p.doc.defaultView.setTimeout||setTimeout)(done,75));if(p.unloading||p.navigationToken!==navigation)return;this.render();const page=view.contentEl.querySelector(`.page[data-page-number="${pageNumber}"]`),scroller=view.contentEl.querySelector('.pdf-viewer-container');if(!page||!scroller)continue;const frames=this.frames.filter(f=>f.record.id===record.id&&f.page===page);if(!frames.length)continue;const rects=frames.map(f=>f.el.getBoundingClientRect()),a=Math.min(...rects.map(r=>r.top)),b=Math.max(...rects.map(r=>r.bottom)),vp=scroller.getBoundingClientRect();scroller.scrollTop+=(a+b)/2-(vp.top+scroller.clientHeight/2);if(i>4)return;}}
 destroy(){this.plugin.doc.defaultView.clearTimeout?.(this.timer);this.observer?.disconnect();this.resizeObserver?.disconnect();for(const view of this.views())for(const el of view.contentEl.querySelectorAll('.aih-pdf-overlay'))el.remove();this.frames=[];}
}
module.exports={PdfSupport,pdfPartsValid,pdfContains,pdfSelected,pdfTree,pdfUpsert,pdfCapture,pageText};

return module.exports;})();
const TYPE='easy-text-highlights';
const refresh=StateEffect.define();
// Independently drawn SVG paths, no external icon/font dependency.
const ICONS={
 filter:[['path',{d:'M4 5h20l-8 9v9l-4-2v-7z'}]],
 check:[['path',{d:'m6 14 5 5L23 7'}]],
 reset:[['path',{d:'M6 10a9 9 0 1 1 0 10M6 4v7h7'}]],
 close:[['path',{d:'m7 7 14 14M21 7 7 21'}]],
 export:[['path',{d:'M14 18V4m-5 5 5-5 5 5M6 15v9h16v-9'}]],
 markdown:[['path',{d:'M7 3h10l5 5v17H7zM17 3v6h5M10 20v-7l3 4 3-4v7M18 15v5m-2-2 2 2 2-2'}]],
 copy:[['path',{d:'M9 8V4h13v15h-4M5 9h12v15H5z'}],['path',{d:'M8 13h6M8 17h4'}]],
 highlight:[['path',{d:'m7 15 8-10 7 6-8 10-7-6zM7 15l-3 7 7-3'}],['path',{d:'M5 25h18',class:'aih-icon-accent'}]],
 wave:[['path',{d:'M5 14c3-9 6 9 9 0s6 9 9 0',class:'aih-icon-accent'}],['path',{d:'M5 23h18',class:'aih-icon-guide'}]],
 underline:[['path',{d:'M8 5v8a6 6 0 0 0 12 0V5'}],['path',{d:'M5 24h18',class:'aih-icon-accent'}]]};
function icon(el,kind,removing=false){const ns='http://www.w3.org/2000/svg',svg=el.ownerDocument.createElementNS(ns,'svg');for(const [k,v] of Object.entries({viewBox:'0 0 28 28',width:28,height:28,fill:'none',stroke:'currentColor','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(k,v);for(const [tag,attrs] of ICONS[kind]){const n=el.ownerDocument.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);svg.append(n);}if(removing){const slash=el.ownerDocument.createElementNS(ns,'path');slash.setAttribute('d','M4 4l20 20');slash.setAttribute('class','aih-icon-slash');svg.append(slash);}el.append(svg);}
const words={
 page:['Page','頁'],
 sourceNote:['Source','來源'],
 deselectAll:['Deselect All','取消全選'],
 filterTitle:['Filter your highlights','篩選你的摘錄'],
 swipeClose:['Drag down to close','向下拖曳關閉'],
 exportHighlights:['Export highlights','匯出摘錄'],markdownFile:['Create Markdown','建立 Markdown'],selectAll:['Select All','全選'],selected:['selected','筆已選'],cancel:['Cancel','取消'],selectExport:['Select highlights to export.','選取要匯出的摘錄。'],exportFailed:['Could not export highlights. Please try again.','無法匯出摘錄，請再試一次。'],noteChanged:['Note changed. Please select highlights again.','筆記已切換，請重新選取摘錄。'],created:['Markdown file created','已建立 Markdown 檔案'],
 filter:['Filter','篩選'],filterTypes:['Types','劃線類型'],filterColors:['Colors','顏色'],filterHint:['No selection means all.','不選即顯示全部。'],confirm:['Confirm','確定'],reset:['Reset','重設'],matches:['matching highlights','筆符合條件'],noMatches:['No highlights match these filters.','沒有符合條件的摘錄。'],
 copyHighlights:['Copy highlights','複製摘錄'],openNote:['Open a note to see its highlights.','開啟筆記即可查看摘錄。'],items:['highlights','筆摘錄'],copyFailed:['Could not copy highlights. Please try again.','無法複製摘錄，請再試一次。'],
 syncColors:['Changing a slot updates every highlight using it, including the sidebar.','修改色格會同步更新所有使用它的劃線與右側摘錄。'],styles:['Styles','樣式'],title:['Highlights','螢光標記'],mark:['Highlight','劃線'],remove:['Remove highlight','刪除劃線'],copy:['Copy','複製'],close:['Close','關閉'],
 custom:['Custom color','自選顏色'],highlight:['Highlighter','馬克筆'],underline:['Underline','下劃線'],wave:['Wavy underline','波浪線'],current:['This note','目前筆記'],all:['All notes','全部筆記'],
 empty:['Select text in a note, then choose Highlight.','選取筆記文字，再按「劃線」。'],missing:['Original text changed; locate manually.','原文已變動，請手動確認。'],
 language:['Language','語言'],defaultColor:['Default color','預設顏色'],defaultStyle:['Default style','預設樣式'],width:['Line thickness','線條粗細'],opacity:['Background opacity','底色不透明度'],palette:['Colors · ribbon palette','顏色 · 緞帶色盤'],
 swatches:['Toolbar colors','工具列配色'],slot:['Color','顏色'],height:['Highlight height','螢光底色高度'],scope:['Show highlights from','標記範圍'],export:['Export highlights','匯出標記'],unsupported:['Select plain text within one paragraph in Reading view, or use Editing view.','閱讀模式請選取同一段落內的純文字，或改用編輯模式。'],
 overlapping:['This selection overlaps another highlight. Edit or remove that highlight first.','此範圍與其他標記重疊，請先修改或刪除原有標記。'],
 saved:['Highlights stay in this vault’s plugin data. Notes remain unchanged. Back up data.json with your vault.','標記儲存在此庫的插件資料，筆記原文不變。請連同 data.json 備份。'],
 copied:['Copied','已複製'],failed:['Could not save highlights. Keep the plugin enabled and try again.','標記儲存失敗，請保持插件啟用並重試。']
};
class Highlighter extends Plugin {
 async onload(){
  const original=await this.loadData()||{};const data=migrateData(original);this.settings=data.settings;
  if(original.schema!==2&&original.records?.length&&this.manifest?.dir&&this.app.vault.adapter?.write){
   const backup=this.manifest.dir+'/data-before-five-slots.json';
   if(!await this.app.vault.adapter.exists(backup))await this.app.vault.adapter.write(backup,JSON.stringify(original,null,2));
  }
  this.records=data.records.filter(r=>typeof r.id==='string'&&typeof r.path==='string'&&typeof r.quote==='string'&&r.quote.length&&Number.isInteger(r.from)&&Number.isInteger(r.to)&&r.from>=0&&r.to>r.from&&['highlight','underline','wave'].includes(r.style)&&PALETTE.some(c=>c.id===r.color)&&(r.kind!=='pdf'||pdfPartsValid(r.parts)));
  this.dialogs=new Set();this.liveSections=new Map();this.undoStack=[];this.redoStack=[];this.undoArmed=false;this.sections=new Set();this.editors=new Set();this.saveChain=Promise.resolve();this.revision=0;this.selectionToken=0;this.unloading=false;
  this.registerView(TYPE,leaf=>new HighlightsView(leaf,this));
  this.addSettingTab(new HighlightSettings(this.app,this));
  this.addRibbonIcon('highlighter',this.t('title'),()=>this.openPanel());
  this.addCommand({id:'open-highlights',name:'Open highlights / 開啟螢光標記',callback:()=>this.openPanel()});
  this.addCommand({id:'highlight-selection',name:this.t('mark'),editorCallback:(editor,view)=>{
   const from=editor.posToOffset(editor.getCursor('from')),to=editor.posToOffset(editor.getCursor('to'));
   if(from<to&&view.file){this.pending={path:view.file.path,...anchor(editor.getValue(),from,to)};this.apply();}
  }});
  this.addCommand({id:'copy-highlights',name:this.t('copyHighlights'),callback:()=>this.copyHighlights()});
  const owner=this;
  this.registerEditorExtension(ViewPlugin.fromClass(class {
   constructor(view){this.view=view;owner.editors.add(view);this.decorations=this.build();owner.scheduleLiveCallouts();}
   build(){
    const path=this.view.state.field(editorInfoField,false)?.file?.path; const text=this.view.state.doc.toString();const ranges=[];
    const positioned=owner.records.filter(r=>r.path===path).map(r=>{const p=resolve(r,text);return p?{...p,r}:null;}).filter(Boolean);
    for(const {from,to,r} of segments(positioned)){
     for(let pos=from;pos<to;){const line=this.view.state.doc.lineAt(pos);const end=Math.min(to,line.to);if(end>pos)ranges.push(Decoration.mark({class:`aih-mark aih-${r.style}`,attributes:{style:owner.markStyle(r),'data-aih-id':r.id}}).range(pos,end));pos=end+1;}
    }
    return Decoration.set(ranges,true);
   }
   update(u){
    if(u.docChanged||u.viewportChanged||u.transactions.length)owner.scheduleLiveCallouts();
    if(u.docChanged){
     owner.undoArmed=false;
     const path=u.startState.field(editorInfoField,false)?.file?.path;const old=u.startState.doc.toString(),next=u.state.doc.toString();let changed=false;
     for(const r of owner.records.filter(r=>r.path===path)){
      const relocated=resolve(r,next);
      if(relocated){Object.assign(r,anchor(next,relocated.from,relocated.to));changed=true;continue;}
      const p=resolve(r,old);if(!p)continue;
      let replacedEntireRange=false;
      u.changes.iterChangedRanges((a,b)=>{if(a<=p.from&&b>=p.to)replacedEntireRange=true;});
      // A disk reload/full replacement must not delete annotations. Keep an unresolved
      // anchor so undo or restoring the original passage can recover it.
      if(replacedEntireRange)continue;
      const from=u.changes.mapPos(p.from,1),to=u.changes.mapPos(p.to,-1);
      if(to>from){Object.assign(r,anchor(next,from,to));changed=true;}
     }
     if(changed){owner.scheduleSave();owner.schedulePanels();}
    }
    if(u.docChanged||u.viewportChanged||u.transactions.some(t=>t.effects.some(e=>e.is(refresh))))this.decorations=this.build();
   }
   destroy(){owner.editors.delete(this.view);}
  },{decorations:v=>v.decorations}));
  this.registerMarkdownPostProcessor((el,ctx)=>{
   if(!ctx.sourcePath)return;const entry={el,ctx};this.sections.add(entry);
   const child=new MarkdownRenderChild(el);child.onunload=()=>this.sections.delete(entry);ctx.addChild(child);
   void this.renderSection(entry);
  });
  const doc=this.app.workspace.containerEl.ownerDocument;this.doc=doc;
  this.pdf=new PdfSupport(this);this.register(()=>this.pdf.destroy());
  if(doc.defaultView.MutationObserver){const observer=new doc.defaultView.MutationObserver(changes=>{if(changes.some(change=>[...change.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.callout')||n.querySelector?.('.callout')))))this.scheduleLiveCallouts();});observer.observe(this.app.workspace.containerEl,{childList:true,subtree:true});this.register(()=>observer.disconnect());}
  const schedule=()=>{if(this.toolbar)return;clearTimeout(this.selectionTimer);this.selectionTimer=setTimeout(()=>void this.capture(),180);};
  this.registerDomEvent(doc,'selectionchange',schedule);
  this.registerDomEvent(doc,'beforeinput',()=>{this.undoArmed=false;},true);
  this.registerDomEvent(doc,'paste',()=>{this.undoArmed=false;this.hide();},true);
  this.registerDomEvent(doc,'cut',()=>{this.undoArmed=false;this.hide();},true);
  this.registerDomEvent(doc,'keydown',e=>{if(this.handleHistoryKey(e))return;if(!this.toolbar?.contains(e.target)&&e.key!=='Shift'&&e.key!=='Control'&&e.key!=='Meta'&&e.key!=='Alt')this.hide();},true);
  this.registerDomEvent(doc,'pointerup',e=>{if(!this.toolbar?.contains(e.target))schedule();},true);
  this.registerDomEvent(doc,'keyup',e=>{if(e.key==='Escape')this.hide();else if(!this.toolbar?.contains(e.target))schedule();});
  this.registerDomEvent(doc,'pointerdown',e=>{
   if(this.toolbar?.contains(e.target))return;
   const mark=e.target.closest?.('[data-aih-id]');this.tapMark=mark?{id:mark.dataset.aihId,rect:mark.getBoundingClientRect(),x:e.clientX,y:e.clientY}:this.pdf.hit(e);this.hide();
  },true);
  this.registerDomEvent(doc,'click',e=>this.openClickedMark(e),true);
  this.registerDomEvent(doc,'scroll',e=>{if(this.toolbar&&!this.toolbar.contains(e.target))this.hide();},true);
  this.registerDomEvent(doc.defaultView,'resize',()=>this.position());
  if(doc.defaultView.visualViewport){this.registerDomEvent(doc.defaultView.visualViewport,'resize',()=>this.position());this.registerDomEvent(doc.defaultView.visualViewport,'scroll',()=>this.position());}
  this.registerEvent(this.app.workspace.on('file-open',()=>{this.hide();this.renderPanels();this.scheduleLiveCallouts();this.pdf.schedule();}));
  this.registerEvent(this.app.vault.on('rename',(file,old)=>{for(const r of this.records){if(r.path===old||r.path.startsWith(old+'/'))r.path=file.path+r.path.slice(old.length);}this.scheduleSave();this.renderPanels();}));
  // Keep annotations for deleted files, so a vault restore can recover them.
  this.registerEvent(this.app.vault.on('delete',()=>this.renderPanels()));
  this.registerEvent(this.app.vault.on('modify',file=>{if(file.extension==='md')void this.reconcile(file);}));
  this.register(()=>{clearTimeout(this.selectionTimer);clearTimeout(this.saveTimer);clearTimeout(this.panelTimer);clearTimeout(this.liveTimer);this.hide();for(const s of this.sections)this.unwrap(s.el);for(const el of this.liveSections.keys())if(el.isConnected)this.unwrap(el);this.liveSections.clear();});
  if(original.schema!==2)await this.persist();
 }
 notice(message){const notice=new Notice(message);(notice.containerEl||notice.noticeEl?.closest?.('.notice'))?.addClass('aih-notice');return notice;}
 t(key){const language=locale(this.settings.language==='auto'?(getLanguage?.()||this.doc?.documentElement.lang||'en'):this.settings.language);return (language==='zh'?words[key]?.[1]:TRANSLATIONS[language]?.[key])||words[key]?.[0]||key;}
 name(c){return this.t('mark')==='劃線'?c.zh:c.en;}
 displayText(r){return r.display||(r.kind==='pdf'?r.quote:projectMarkdown(r.quote).text);}
 colorHex(r){return slotHex(r,this.settings);}
 markStyle(r){const hex=this.colorHex(r);return `--aih-color:${hex};--aih-tint:${rgba(hex,this.settings.opacity)};--aih-width:${this.settings.width}px;--aih-height:${this.settings.height}px` ;}
 scheduleSave(){clearTimeout(this.saveTimer);this.saveTimer=setTimeout(()=>void this.persist(),250);}
 persist(){const data=JSON.parse(JSON.stringify({schema:2,settings:this.settings,records:this.records}));this.saveChain=this.saveChain.catch(()=>{}).then(()=>this.saveData(data)).catch(e=>{console.error('Easy Text Highlighter: save failed',e);this.notice(this.t('failed'));});return this.saveChain;}
 async onunload(){this.unloading=true;for(const dialog of this.dialogs)dialog.close();clearTimeout(this.saveTimer);await this.persist();}
 schedulePanels(){clearTimeout(this.panelTimer);this.panelTimer=setTimeout(()=>this.renderPanels(),160);}
 renderPanels(){for(const leaf of this.app.workspace.getLeavesOfType(TYPE))leaf.view.render();}
 async openPanel(){let leaf=this.app.workspace.getLeavesOfType(TYPE)[0]||this.app.workspace.getRightLeaf(false);if(!leaf)return;await leaf.setViewState({type:TYPE,active:true});await this.app.workspace.revealLeaf(leaf);this.renderPanels();}
 openClickedMark(e){
  if(this.toolbar?.contains(e.target))return;
  const tap=this.tapMark;this.tapMark=null;
  if(this.doc.getSelection()?.toString().trim()||(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6))return;
  const mark=e.target.closest?.('[data-aih-id]');
  const clicked=mark?{id:mark.dataset.aihId,rect:mark.getBoundingClientRect()}:tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6?tap:null;
  const record=clicked&&this.records.find(r=>r.id===clicked.id);if(!record)return;
  clearTimeout(this.selectionTimer);this.selectionToken++;this.pending={...record};this.rect=clicked.rect;this.show(record,true,true);
 }
 commitRecords(next){
  const before=this.records.map(r=>({...r})),after=next.map(r=>({...r}));
  const ids=new Set([...before,...after].map(r=>r.id));const changed=[...ids].filter(id=>JSON.stringify(before.find(r=>r.id===id))!==JSON.stringify(after.find(r=>r.id===id)));
  if(!changed.length)return;this.undoStack.push({before:before.filter(r=>changed.includes(r.id)),after:after.filter(r=>changed.includes(r.id)),ids:changed});if(this.undoStack.length>100)this.undoStack.shift();this.redoStack=[];this.undoArmed=true;this.records=next;
 }
 handleHistoryKey(e){
  if(e.isComposing||e.altKey)return false;
  const key=e.key.toLowerCase(),shortcut=(e.metaKey||e.ctrlKey)&&!e.repeat;
  if(shortcut&&['v','x'].includes(key)){this.undoArmed=false;return false;}
  if(!shortcut||!['z','y'].includes(key)){if(!e.metaKey&&!e.ctrlKey&&(key.length===1||['backspace','delete','enter'].includes(key)))this.undoArmed=false;return false;}
  if(!this.undoArmed||e.target?.closest?.('input,textarea,select,.modal-container,.workspace-leaf-content[data-type="easy-text-highlights"]'))return false;
  const redo=key==='y'||e.shiftKey,from=redo?this.redoStack:this.undoStack,to=redo?this.undoStack:this.redoStack;
  const action=from.pop();if(!action)return false;
  e.preventDefault();e.stopImmediatePropagation();this.records=this.records.filter(r=>!action.ids.includes(r.id)).concat((redo?action.after:action.before).map(r=>({...r})));to.push(action);this.hide();this.scheduleSave();this.redraw();return true;
 }
 currentView(){return this.app.workspace.getActiveViewOfType(MarkdownView)||this.app.workspace.getMostRecentLeaf()?.view;}
 async reconcile(file){
  const text=await this.app.vault.cachedRead(file);let changed=false;
  for(const r of this.records.filter(r=>r.path===file.path)){const p=resolve(r,text);if(p&&(p.from!==r.from||p.to!==r.to)){Object.assign(r,anchor(text,p.from,p.to));changed=true;}}
  if(changed)this.scheduleSave();this.redraw(false);
 }
 scheduleLiveCallouts(){clearTimeout(this.liveTimer);this.liveTimer=setTimeout(()=>{if(!this.unloading)void this.renderLiveCallouts();},60);}
 async renderLiveCallouts(){
  for(const [el] of this.liveSections)if(!el.isConnected)this.liveSections.delete(el);
  for(const leaf of this.app.workspace.getLeavesOfType('markdown')){
   const view=leaf.view;if(!(view instanceof MarkdownView)||view.getMode()!=='source'||!view.file)continue;
   const source=view.editor.getValue();
   for(const el of view.contentEl.querySelectorAll('.callout')){
    if(el.parentElement?.closest('.callout'))continue;
    let entry=this.liveSections.get(el);if(!entry){entry={el,ctx:{sourcePath:view.file.path,getSectionInfo:()=>({lineStart:0,lineEnd:source.split('\n').length-1})}};this.liveSections.set(el,entry);}
    const stamp=this.revision+'\n'+source;if(entry.stamp===stamp)continue;entry.stamp=stamp;entry.ctx.sourcePath=view.file.path;entry.ctx.getSectionInfo=()=>({lineStart:0,lineEnd:source.split('\n').length-1});
    await this.renderSection(entry,source);
   }
  }
 }
 unwrap(el){for(const m of el.querySelectorAll('span[data-aih-id]'))m.replaceWith(...m.childNodes);el.normalize();}
 async renderSection(entry,liveSource){
  const {el,ctx}=entry;
  if(liveSource===undefined&&el.closest?.('.markdown-source-view')&&(el.closest?.('.callout')||el.querySelector?.('.callout'))){this.scheduleLiveCallouts();return;}
  const revision=(entry.revision||0)+1;entry.revision=revision;const info=ctx.getSectionInfo(el);if(!info)return;
  const file=this.app.vault.getAbstractFileByPath(ctx.sourcePath);if(!file)return;
  const source=liveSource===undefined?await this.app.vault.cachedRead(file):liveSource;if(this.unloading||entry.revision!==revision)return;
  this.unwrap(el);
  const lines=source.split('\n');const start=lines.slice(0,info.lineStart).join('\n').length+(info.lineStart?1:0);const end=start+lines.slice(info.lineStart,info.lineEnd+1).join('\n').length;
  const doc=el.ownerDocument;const walker=doc.createTreeWalker(el,4);const nodes=[];let text='',n;
  while((n=walker.nextNode())){if(n.parentElement.closest('button,script,style,.copy-code-button,.collapse-indicator,.metadata-container'))continue;nodes.push({node:n,start:text.length,end:text.length+n.textContent.length});text+=n.textContent;}
  const mapping=visibleMap(source.slice(start,end),text,start);if(!mapping)return;
  const ranges=[];
  for(const r of this.records.filter(r=>r.path===ctx.sourcePath)){
   const p=resolve(r,source);if(!p||p.to<=start||p.from>=end)continue;
   let first=-1,last=-1;
   for(let i=0;i<mapping.length;i++){const m=mapping[i];if(m&&m.from<p.to&&m.to>p.from){if(first<0)first=i;last=i+1;}}
   if(first>=0)ranges.push({from:first,to:last,r});
  }
  for(const {node,start:ns,end:ne} of nodes.reverse()){
   const parts=segments(ranges).filter(x=>x.from<ne&&x.to>ns).sort((a,b)=>b.from-a.from);
   for(const part of parts){const from=Math.max(0,part.from-ns),to=Math.min(ne-ns,part.to-ns);if(to<node.length)node.splitText(to);const selected=from?node.splitText(from):node;const span=doc.createElement('span');span.className=`aih-mark aih-${part.r.style}`;span.dataset.aihId=part.r.id;span.setAttribute('style',this.markStyle(part.r));selected.replaceWith(span);span.append(selected);}
  }
 }
 redraw(editors=true){if(this.unloading)return;this.pdf?.schedule();this.revision++;this.scheduleLiveCallouts();if(editors)for(const view of this.editors){try{view.dispatch({effects:refresh.of(this.revision)});}catch(e){console.warn('Highlighter refresh',e);}}for(const s of this.sections)if(s.el.isConnected)void this.renderSection(s);this.renderPanels();if(this.toolbar){const r=this.records.find(x=>x.id===this.toolbar.dataset.highlightId);this.toolbar.style.setProperty('--aih-choice',this.colorHex(r||{color:this.settings.color}));for(const sw of this.toolbar.querySelectorAll('[data-aih-slot]'))sw.style.setProperty('--aih-swatch',this.settings.colors[sw.dataset.aihSlot]);}}

 async capture(){
  const token=++this.selectionToken;if(this.toolbar?.contains(this.doc.activeElement))return;
  let view=this.currentView();
  const sel=this.doc.getSelection();if(!sel||sel.isCollapsed||!sel.toString().trim())return this.hide();
  const range=sel.getRangeAt(0);
  const pdf=this.pdf?.capture(range);if(pdf){if(token!==this.selectionToken)return;this.pending=pdf.pending;this.rect=range.getBoundingClientRect();const existing=pdfSelected(this.records,pdf.pending);this.show(existing,false,!!existing&&pdfContains(existing,pdf.pending));return;}
  if(!(view instanceof MarkdownView)||!view.contentEl.contains(range.commonAncestorContainer))view=this.app.workspace.getLeavesOfType('markdown').map(l=>l.view).find(v=>v instanceof MarkdownView&&v.contentEl.contains(range.commonAncestorContainer));
  if(!view?.file)return this.hide();
  const selectedElement=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement;const callout=selectedElement?.closest?.('.callout');
  let pending,source;
  if(view.getMode()==='source'&&!callout){
   const ed=view.editor;if(ed.listSelections().length!==1)return this.hide();source=ed.getValue();
   const candidates=[];const cm=[...this.editors].find(editor=>editor.dom?.contains(range.commonAncestorContainer));
   if(cm){try{const a=cm.posAtDOM(range.startContainer,range.startOffset),b=cm.posAtDOM(range.endContainer,range.endOffset);candidates.push({from:Math.min(a,b),to:Math.max(a,b)});}catch{/* A replaced Live Preview node may no longer belong to the editor. */}}
   candidates.push({from:ed.posToOffset(ed.getCursor('from')),to:ed.posToOffset(ed.getCursor('to'))});
   const bounds=editorSelectionBounds(source,sel.toString(),candidates);if(!bounds)return this.hide();pending={path:view.file.path,...anchor(source,bounds.from,bounds.to)};
  }else{
   const text=view.getMode()==='source'?view.editor.getValue():await this.app.vault.cachedRead(view.file);source=text;let selectionFrom=Infinity,selectionTo=-Infinity;
   const entries=[...this.sections];if(callout&&view.contentEl.contains(callout))entries.push({el:callout,ctx:{sourcePath:view.file.path,getSectionInfo:()=>({lineStart:0,lineEnd:text.split('\n').length-1})}});
   for(const entry of entries){
    if(entry.ctx.sourcePath!==view.file.path||!view.contentEl.contains(entry.el)||!range.intersectsNode(entry.el))continue;
    const info=entry.ctx.getSectionInfo(entry.el);if(!info)continue;
    const lines=text.split('\n');const start=lines.slice(0,info.lineStart).join('\n').length+(info.lineStart?1:0),end=start+lines.slice(info.lineStart,info.lineEnd+1).join('\n').length;
    const walker=this.doc.createTreeWalker(entry.el,4),nodes=[];let visible='',node;
    while((node=walker.nextNode())){if(node.parentElement.closest('button,script,style,.copy-code-button,.collapse-indicator,.metadata-container'))continue;nodes.push({node,start:visible.length});visible+=node.textContent;}
    const mapping=visibleMap(text.slice(start,end),visible,start);if(!mapping)continue;
    for(const item of nodes){if(!range.intersectsNode(item.node))continue;const from=range.startContainer===item.node?range.startOffset:0,to=range.endContainer===item.node?range.endOffset:item.node.length;
     for(let i=from;i<to;i++){const m=mapping[item.start+i];if(m){selectionFrom=Math.min(selectionFrom,m.from);selectionTo=Math.max(selectionTo,m.to);}}
    }
   }
   if(!Number.isFinite(selectionFrom))return this.hide();
   const from=selectionFrom,to=selectionTo;
   pending={path:view.file.path,...anchor(text,from,to),display:sel.toString()};
  }
  if(token!==this.selectionToken)return;this.pending=pending;this.rect=range.getBoundingClientRect();const existing=selectedMark(this.records,pending,source);const bounds=existing&&resolve(existing,source);this.show(existing,false,!!bounds&&pending.from>=bounds.from&&pending.to<=bounds.to);
 }
 hide(){this.selectionToken++;this.toolbar?.remove();this.toolbar=null;this.pending=null;}
 button(parent,text,action,cls=''){const b=parent.createEl('button',{text,cls});b.type='button';b.addEventListener('click',action);return b;}
 show(record,expanded,canRemove=true){
  this.toolbar?.remove();const root=this.doc.body.createDiv({cls:'aih-float'});this.toolbar=root;root.setAttribute('role','dialog');root.setAttribute('aria-label',this.t('title'));
  root.dataset.highlightId=record?.id||'';
  root.style.setProperty('--aih-choice',this.colorHex(record||{color:this.settings.color}));
  root.addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault();});
  const bar=root.createDiv({cls:'aih-toolbar'});bar.setAttribute('role','toolbar');
  for(const kind of ['copy','wave','underline','highlight']){
   const action=kind==='copy'?async()=>{try{await navigator.clipboard.writeText(this.displayText(this.pending));this.notice(this.t('copied'));}catch{this.notice(this.t('copyFailed'));}}:()=>{
    // Only a selection fully inside this annotation deletes it; extensions apply/merge.
    if(canRemove&&record&&record.style===kind){this.commitRecords(this.records.filter(r=>r.id!==record.id));this.scheduleSave();this.redraw();this.show(null,false);}
    else void this.apply({style:kind});
   };
   const b=this.button(bar,'',action,'aih-tool');const removing=canRemove&&record?.style===kind;icon(b,kind,removing);b.dataset.kind=kind;b.dataset.action=removing?'remove':kind;b.setAttribute('aria-label',this.t(removing?'remove':kind));
   if(kind!=='copy')b.setAttribute('aria-pressed',String(canRemove&&record?.style===kind));
  }
  if(record){
   const palette=root.createDiv({cls:'aih-colorbar'});palette.setAttribute('role','group');palette.setAttribute('aria-label',this.t('palette'));
   for(let i=0;i<PALETTE.length;i++){
    const c=PALETTE[i],id=c.id;const b=this.button(palette,record.color===id?'✓':'',()=>void this.apply({color:id,style:record.style}),'aih-swatch');
    b.dataset.aihSlot=id;b.style.setProperty('--aih-swatch',this.settings.colors[id]);const label=this.t('slot')+' '+(i+1)+' · '+this.settings.colors[id];b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',String(record.color===id));
   }
  }
  this.position();
 }
 position(){
  if(!this.toolbar||!this.rect)return;
  const win=this.doc.defaultView,v=win.visualViewport;const vp={left:v?.offsetLeft||0,top:v?.offsetTop||0,width:v?.width||win.innerWidth,height:v?.height||win.innerHeight};
  this.toolbar.style.maxWidth=Math.max(0,vp.width-16)+'px';this.toolbar.style.maxHeight=Math.max(0,vp.height-16)+'px';
  const bar=this.toolbar.querySelector('.aih-toolbar'),palette=this.toolbar.querySelector('.aih-colorbar');
  if(palette)this.toolbar.style.setProperty('--aih-toolbar-width',bar.getBoundingClientRect().width+'px');
  this.toolbar.dataset.paletteSide=palette?paletteSide(this.rect,bar.getBoundingClientRect(),palette.getBoundingClientRect(),vp):'above';
  const p=place(this.rect,this.toolbar.getBoundingClientRect(),vp);Object.assign(this.toolbar.style,{left:p.left+'px',top:p.top+'px'});
 }

 async apply(change={}){
  if(!this.pending)return;const pending={...this.pending};const file=this.app.vault.getAbstractFileByPath(pending.path);if(!file)return;
  if(pending.kind==='pdf'){const result=pdfUpsert(this.records,pending,this.pdf.texts(pending),change,{color:this.settings.color,style:this.settings.style},this.doc.defaultView.crypto.randomUUID());if(!result){this.notice(this.t('missing'));return this.hide();}this.commitRecords(result.records);if(change.color)this.settings.color=change.color;if(change.style)this.settings.style=change.style;this.pending={...result.record};this.scheduleSave();this.redraw();this.show(result.record,true);return;}
  const view=this.currentView();const text=view instanceof MarkdownView&&view.file?.path===pending.path&&view.getMode()==='source'?view.editor.getValue():await this.app.vault.cachedRead(file);
  const p=resolve(pending,text);if(!p){this.notice(this.t('missing'));return this.hide();}
  const result=upsert(this.records,{...pending,...p},text,change,{color:this.settings.color,style:this.settings.style},this.doc.defaultView.crypto.randomUUID());
  const record=result.record;
  this.commitRecords(result.records);
  if(change.color)this.settings.color=change.color;if(change.style)this.settings.style=change.style;
  this.pending={...record};this.scheduleSave();this.redraw();this.show(record,true);
 }
 async jump(r){
  const navigation=this.navigationToken=(this.navigationToken||0)+1;
  clearTimeout(this.selectionTimer);this.tapMark=null;this.hide();this.doc.getSelection?.()?.removeAllRanges();
  const file=this.app.vault.getAbstractFileByPath(r.path);if(!file){this.notice(this.t('missing'));return;}
  if(r.kind==='pdf'){const leaf=this.app.workspace.getLeaf(false);await leaf.openFile(file,{active:true});await this.pdf.jump(leaf.view,r,navigation);return;}
  const text=await this.app.vault.cachedRead(file),p=resolve(r,text);if(!p){this.notice(this.t('missing'));return;}
  const leaf=this.app.workspace.getLeaf(false);await leaf.openFile(file,{active:true});const view=leaf.view;
  const line=text.slice(0,p.from).split('\n').length-1;
  if(view instanceof MarkdownView){
   if(view.getMode()==='source'){const from=view.editor.offsetToPos(p.from),to=view.editor.offsetToPos(p.to);view.editor.setCursor(from);view.editor.scrollIntoView({from,to},true);view.editor.focus();}
   else view.setEphemeralState({line});
   await this.centerJump(view,p,r.id,navigation);
  }
 }
 async centerJump(view,range,id,navigation){
  // Initial line navigation mounts virtualized content. Recenter after layout settles.
  for(let attempt=0;attempt<6;attempt++){
   await new Promise(done=>setTimeout(done,50));
   if(this.unloading||navigation!==this.navigationToken)return;
   const cm=[...this.editors].find(editor=>view.contentEl.contains?.(editor.dom));
   const scroller=view.getMode()==='source'?cm?.scrollDOM:view.contentEl.querySelector('.markdown-preview-view');
   if(!scroller)continue;
   let top,bottom;
   if(cm&&view.getMode()==='source'){
    const a=cm.coordsAtPos(range.from),b=cm.coordsAtPos(Math.max(range.from,range.to-1));
    if(a&&b){top=a.top;bottom=b.bottom;}
   }
   if(top===undefined){
    const nodes=view.contentEl.querySelectorAll?.('[data-aih-id]')||[];
    const rects=[...nodes].filter(el=>el.dataset.aihId===id).flatMap(el=>[...el.getClientRects()]);
    if(rects.length){top=Math.min(...rects.map(r=>r.top));bottom=Math.max(...rects.map(r=>r.bottom));}
   }
   if(top===undefined)continue;
   const viewport=scroller.getBoundingClientRect();
   scroller.scrollTop+=((top+bottom)/2)-(viewport.top+scroller.clientHeight/2);
  }
 }
 async noteHighlights(filter={},ids){
  const file=this.app.workspace.getActiveFile();if(!file||!['md','pdf'].includes(file.extension))return null;
  if(file.extension==='pdf'){const records=this.records.filter(r=>r.path===file.path&&r.kind==='pdf');return {file,source:'',records,tree:pdfTree(records.filter(r=>matchesHighlightFilter(r,filter)&&(!ids||ids.includes(r.id))),this.t('page'))};}
  const live=this.app.workspace.getLeavesOfType('markdown').map(l=>l.view).find(v=>v instanceof MarkdownView&&v.file?.path===file.path&&v.getMode()==='source');
  const source=live?live.editor.getValue():await this.app.vault.cachedRead(file);
  const records=this.records.filter(r=>r.path===file.path);return {file,source,records,tree:highlightOutline(source,records.filter(r=>matchesHighlightFilter(r,filter)&&(!ids||ids.includes(r.id))),file.path)};
 }
 exportContent(model,destination){return outlineMarkdown(model.tree,model.file.basename,r=>this.displayText(r)+(r.kind==='pdf'?'\n\n'+[...new Set(r.parts.map(part=>part.page))].map(page=>this.app.fileManager.generateMarkdownLink(model.file,destination,'#page='+page,this.t('page')+' '+page)).join(' · '):''));}
 async copyHighlights(filter={},ids){
  const model=await this.noteHighlights(filter,ids);if(!model||!model.tree.count)return;
  try{await navigator.clipboard.writeText(this.exportContent(model,model.file.path));this.notice(this.t('copied'));}catch{this.notice(this.t('copyFailed'));}
 }
 async exportSelected(format,filter,ids,path){
  if(!ids.length)return false;const model=await this.noteHighlights(filter,ids);if(!model||model.file.path!==path){this.notice(this.t('noteChanged'));return false;}if(!model.tree.count)return false;
  const content=this.exportContent(model,model.file.path);
  try{if(format==='copy'){await navigator.clipboard.writeText(content);this.notice(this.t('copied'));}
   else{const folder=model.file.path.includes('/')?model.file.path.slice(0,model.file.path.lastIndexOf('/')+1):'';let name=folder+model.file.basename+' - Highlights.md',i=2;while(this.app.vault.getAbstractFileByPath(name))name=folder+model.file.basename+' - Highlights '+(i++)+'.md';const link=this.app.fileManager.generateMarkdownLink(model.file,name);const body=model.file.extension==='pdf'?this.exportContent(model,name):content;const exported=body.replace('\n\n','\n\n'+this.t('sourceNote')+': '+link+'\n\n');await this.app.vault.create(name,exported);this.notice(this.t('created')+' · '+name);}
   return true;
  }catch(e){console.error('Highlighter export',e);this.notice(this.t('exportFailed'));return false;}
 }

}
class HighlightsView extends ItemView {
 constructor(leaf,plugin){super(leaf);this.plugin=plugin;this.renderToken=0;this.applied={types:[],colors:[]};this.dialog=null;this.exportMode=false;this.selected=new Set();this.exportPath=null;this.exportBusy=false;}
 getViewType(){return TYPE;}getDisplayText(){return this.plugin.t('title');}getIcon(){return 'highlighter';}
 async onOpen(){await this.render();}
 async onClose(){this.renderToken++;this.dialog?.close();}
 openDialog(kind){if(kind==='export')return this.toggleExport();this.dialog?.close();this.dialog=new HighlightsDialog(this,kind);this.dialog.open();}
 async toggleExport(){
  if(this.exportBusy)return;if(this.exportMode){this.exportMode=false;this.selected.clear();await this.render();return;}
  const model=await this.plugin.noteHighlights(this.applied);if(!model)return;this.dialog?.close();this.exportMode=true;this.exportPath=model.file.path;this.selected=new Set(model.records.filter(r=>matchesHighlightFilter(r,this.applied)).map(r=>r.id));await this.render();
 }
 async runExport(format){
  if(this.exportBusy||!this.exportMode||!this.selected.size)return;this.exportBusy=true;const ids=[...this.selected],path=this.exportPath,filter=this.applied;void this.render();
  try{if(await this.plugin.exportSelected(format,filter,ids,path)){this.exportMode=false;this.selected.clear();}}finally{this.exportBusy=false;await this.render();}
 }
 async render(){
  const token=++this.renderToken,p=this.plugin,c=this.contentEl;const model=await p.noteHighlights(this.applied);if(token!==this.renderToken)return;
  c.empty();c.addClass('aih-sidebar');c.createEl('h3',{text:p.t('title')});
  if(!model){this.exportMode=false;this.selected.clear();c.createEl('p',{text:p.t('openNote'),cls:'aih-empty'});return;}
  if(this.exportMode&&this.exportPath!==model.file.path){this.exportMode=false;this.selected.clear();}
  const visible=model.records.filter(r=>matchesHighlightFilter(r,this.applied));const visibleIds=new Set(visible.map(r=>r.id));this.selected=new Set([...this.selected].filter(id=>visibleIds.has(id)));
  c.createEl('div',{text:model.file.basename,cls:'aih-note-name'});
  const top=c.createDiv({cls:'aih-sidebar-actions'});const summary=top.createDiv({cls:'aih-selection-summary'});const count=summary.createSpan({cls:'aih-count'});count.setAttribute('role','status');count.setAttribute('aria-live','polite');
  const actions=top.createDiv({cls:'aih-sidebar-icon-actions'});
  for(const [kind,label] of [['filter',p.t('filter')],['export',p.t(this.exportMode?'cancel':'exportHighlights')]]){const b=p.button(actions,'',()=>this.openDialog(kind),'aih-panel-icon'+(kind==='export'&&this.exportMode?' aih-export-exit mod-warning':''));icon(b,kind==='export'&&this.exportMode?'close':kind);b.setAttribute('aria-label',label);b.disabled=this.exportBusy;}
  if(!model.tree.count)c.createEl('p',{text:p.t(model.records.length?'noMatches':'empty'),cls:'aih-empty'});
  let deselect;
  if(this.exportMode){deselect=p.button(summary,p.t('deselectAll'),()=>{if(this.exportBusy)return;const all=this.selected.size===visible.length;this.selected=all?new Set():new Set(visible.map(r=>r.id));for(const check of list.querySelectorAll('input'))check.checked=!all;update();},'aih-deselect-all');summary.prepend(deselect);}
  const list=c.createDiv({cls:'aih-flat-list'});let copy,markdown;
  const update=()=>{count.textContent=this.exportMode?this.selected.size+' / '+visible.length+' '+p.t('selected'):model.tree.count+' / '+model.records.length+' '+p.t('items');for(const check of list.querySelectorAll('input'))check.disabled=this.exportBusy;if(copy)copy.disabled=markdown.disabled=this.exportBusy||!this.selected.size;if(deselect){deselect.disabled=this.exportBusy||!visible.length;deselect.textContent=p.t(this.selected.size===visible.length?'deselectAll':'selectAll');}};
  this.renderRows(list,model,this.exportMode,(id,checked)=>{if(this.exportBusy)return;if(checked)this.selected.add(id);else this.selected.delete(id);update();});
  if(this.exportMode){const footer=c.createDiv({cls:'aih-export-footer'});for(const [format,label,kind] of [['copy',p.t('copy'),'copy'],['markdown',p.t('markdownFile'),'markdown']]){const b=p.button(footer,'',()=>void this.runExport(format),'aih-export-footer-action');icon(b,kind);b.createSpan({text:label});if(format==='copy')copy=b;else markdown=b;}}update();
  if(this.dialog&&!this.dialog.busy)void this.dialog.refresh();
 }
 styleBadge(parent,r){const p=this.plugin,soft=softStyleBadge(p.colorHex(r));const badge=parent.createSpan({cls:'aih-entry-style'});badge.style.setProperty('--aih-badge',soft.background);badge.style.setProperty('--aih-badge-ink',soft.ink);icon(badge,r.style);}
 renderRows(container,model,selecting,onSelection){
  const p=this.plugin;for(const group of flatHighlightGroups(model.tree)){
   const section=container.createDiv({cls:'aih-flat-group'});if(group.title)section.createEl('div',{text:group.title,cls:'aih-flat-heading'});
   for(const r of group.items){const row=section.createDiv({cls:'aih-entry aih-selectable-row'+(selecting?' aih-export-row':'')});const b=p.button(row,'',selecting?()=>{if(this.exportBusy)return;const check=row.querySelector('input');check.checked=!check.checked;check.dispatchEvent(new Event('change'));}:()=>void p.jump(r),'aih-entry-link aih-style-row');b.setAttribute('aria-label',(selecting?p.t('selectExport'):p.t(r.style))+' · '+p.displayText(r));this.styleBadge(b,r);const text=b.createSpan({cls:'aih-entry-text'});const excerpt=text.createSpan({text:p.displayText(r),cls:'aih-excerpt aih-'+r.style});excerpt.setAttribute('style',p.markStyle(r));
    if(selecting){const check=row.createEl('input',{cls:'aih-export-check'});check.type='checkbox';check.checked=this.selected.has(r.id);check.setAttribute('aria-label',p.t('selectExport')+' '+p.displayText(r));check.addEventListener('change',()=>onSelection(r.id,check.checked));}
   }
  }
 }
}
class HighlightsDialog extends Modal {
 constructor(view,kind){super(view.plugin.app);this.view=view;this.plugin=view.plugin;this.kind=kind;this.draft={types:[...view.applied.types],colors:[...view.applied.colors]};this.selected=new Set();this.path=null;this.token=0;this.busy=false;this.closed=false;this.plugin.dialogs.add(this);}
 onOpen(){
  this.modalEl.addClass('aih-dialog');this.contentEl.addClass('aih-dialog-content');this.containerEl?.addClass('aih-dialog-container');
  const handle=this.modalEl.createDiv({cls:'aih-sheet-handle'});this.modalEl.prepend(handle);handle.setAttribute('aria-label',this.plugin.t('swipeClose'));handle.setAttribute('role','button');handle.tabIndex=0;
  handle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.close();}});
  const sheet=()=>this.modalEl.ownerDocument.defaultView.matchMedia('(max-width:700px), (pointer:coarse)').matches;
  handle.addEventListener('pointerdown',e=>{if(!sheet()||this.busy||e.button>0)return;this.sheetDrag={id:e.pointerId,y:e.clientY,time:Date.now(),distance:0};handle.setPointerCapture?.(e.pointerId);this.modalEl.removeClass('aih-sheet-settling');});
  handle.addEventListener('pointermove',e=>{const drag=this.sheetDrag;if(!drag||e.pointerId!==drag.id)return;drag.distance=Math.max(0,e.clientY-drag.y);this.modalEl.style.setProperty('--aih-sheet-y',drag.distance+'px');if(e.cancelable)e.preventDefault();});
  const finish=(e,cancelled=false)=>{const drag=this.sheetDrag;if(!drag||e.pointerId!==drag.id)return;this.sheetDrag=null;if(!cancelled&&dismissSheet(drag.distance,Date.now()-drag.time,this.modalEl.getBoundingClientRect().height)){const win=this.modalEl.ownerDocument.defaultView;if(win.matchMedia('(prefers-reduced-motion:reduce)').matches){this.close();return;}this.modalEl.addClass('aih-sheet-settling');this.modalEl.style.setProperty('--aih-sheet-y',this.modalEl.getBoundingClientRect().height+'px');this.sheetTimer=setTimeout(()=>this.close(),180);}else{this.modalEl.addClass('aih-sheet-settling');this.modalEl.style.removeProperty('--aih-sheet-y');}};
  handle.addEventListener('pointerup',e=>finish(e));handle.addEventListener('pointercancel',e=>finish(e,true));void this.refresh();
 }
 onClose(){clearTimeout(this.sheetTimer);this.sheetDrag=null;this.closed=true;this.plugin.dialogs.delete(this);this.token++;if(this.view.dialog===this)this.view.dialog=null;this.contentEl.empty();}
 action(parent,label,kind,fn,cls=''){const b=this.plugin.button(parent,'',fn,'aih-dialog-action '+cls);icon(b,kind);b.createSpan({text:label});return b;}
 async refresh(){
  const token=++this.token,p=this.plugin,model=await p.noteHighlights(this.view.applied);if(this.closed||token!==this.token)return;
  if(!model){this.close();return;}if(this.path&&this.path!==model.file.path){this.close();return;}this.path=model.file.path;this.contentEl.empty();
  this.contentEl.createEl('h2',{text:p.t(this.kind==='filter'?'filterTitle':'exportHighlights')});if(this.kind!=='filter')this.contentEl.createEl('p',{text:model.file.basename,cls:'aih-dialog-note'});
  this.renderFilter(model);
 }
 renderFilter(model){
  const p=this.plugin,c=this.contentEl;
  c.createEl('div',{text:p.t('filterTypes'),cls:'aih-filter-label'});const types=c.createDiv({cls:'aih-filter-options'});types.setAttribute('role','group');types.setAttribute('aria-label',p.t('filterTypes'));
  const buttons=[];let preview;const update=()=>{for(const {button,key,id} of buttons)button.setAttribute('aria-pressed',String(this.draft[key].includes(id)));if(preview)preview.textContent=model.records.filter(r=>matchesHighlightFilter(r,this.draft)).length+' '+p.t('matches');};
  const choice=(parent,key,id,label,cls)=>{const b=p.button(parent,'',()=>{this.draft[key]=this.draft[key].includes(id)?this.draft[key].filter(x=>x!==id):[...this.draft[key],id];update();},cls);b.setAttribute('aria-label',label);buttons.push({button:b,key,id});return b;};
  for(const kind of ['highlight','wave','underline'])icon(choice(types,'types',kind,p.t(kind),'aih-filter-type'),kind);
  c.createEl('div',{text:p.t('filterColors'),cls:'aih-filter-label'});const colors=c.createDiv({cls:'aih-filter-options'});colors.setAttribute('role','group');colors.setAttribute('aria-label',p.t('filterColors'));
  for(const color of PALETTE){const b=choice(colors,'colors',color.id,p.settings.colors[color.id],'aih-filter-color');b.style.setProperty('--aih-swatch',p.settings.colors[color.id]);b.style.setProperty('--aih-swatch-ink',badgeInk(p.settings.colors[color.id]));b.createSpan({text:'✓',cls:'aih-filter-check'});}
  preview=c.createEl('p',{cls:'aih-filter-preview'});preview.setAttribute('role','status');preview.setAttribute('aria-live','polite');update();
  const actions=c.createDiv({cls:'aih-dialog-actions aih-filter-dialog-actions'});
  this.action(actions,p.t('reset'),'reset',()=>{this.draft={types:[],colors:[]};this.view.applied={types:[],colors:[]};void this.view.render();});
  this.action(actions,p.t('confirm'),'check',()=>{this.view.applied={types:[...this.draft.types],colors:[...this.draft.colors]};this.close();void this.view.render();},'mod-cta');
 }
}

class HighlightSettings extends PluginSettingTab {
 constructor(app,plugin){super(app,plugin);this.plugin=plugin;}
 display(){const p=this.plugin,c=this.containerEl;c.empty();c.addClass('aih-settings');new Setting(c).setName(p.t('title')).setHeading().settingEl.addClass('aih-settings-heading');c.createEl('p',{text:p.t('saved')});
  const save=()=>{p.scheduleSave();p.redraw();};
  new Setting(c).setName(p.t('language')).addDropdown(d=>d.addOptions(LANGUAGES).setValue(p.settings.language).onChange(v=>{p.settings.language=v;save();this.display();}));
  new Setting(c).setName(p.t('defaultStyle')).addDropdown(d=>d.addOptions(Object.fromEntries(['highlight','underline','wave'].map(k=>[k,p.t(k)]))).setValue(p.settings.style).onChange(v=>{p.settings.style=v;save();}));
  new Setting(c).setName(p.t('defaultColor')).addDropdown(d=>d.addOptions(Object.fromEntries(PALETTE.map((c,i)=>[c.id,p.t('slot')+' '+(i+1)]))).setValue(p.settings.color).onChange(v=>{p.settings.color=v;save();}));
  new Setting(c).setName(p.t('width')).setDesc('1–5 px · '+p.settings.width+' px').addSlider(s=>s.setLimits(1,5,.5).setValue(p.settings.width).setDynamicTooltip().onChange(v=>{p.settings.width=v;save();}));
  new Setting(c).setName(p.t('opacity')).addSlider(s=>s.setLimits(.1,.7,.05).setValue(p.settings.opacity).setDynamicTooltip().onChange(v=>{p.settings.opacity=v;save();}));
  new Setting(c).setName(p.t('height')).setDesc('0–5 px').addSlider(s=>s.setLimits(0,5,.5).setValue(p.settings.height).setDynamicTooltip().onChange(v=>{p.settings.height=v;save();}));
  new Setting(c).setName(p.t('swatches')).setHeading().settingEl.addClass('aih-settings-heading');
  c.createEl('p',{text:p.t('syncColors')});
  for(let i=0;i<5;i++){
   const color=PALETTE[i],id=color.id;
   new Setting(c).setName(p.t('slot')+' '+(i+1))
    .addColorPicker(s=>s.setValue(p.settings.colors[id]).onChange(v=>{p.settings.colors[id]=v;save();}))
    .addExtraButton(b=>b.setIcon('reset').setTooltip(p.t('reset')).onClick(()=>{p.settings.colors[id]=color.hex;save();this.display();}));
  }
 }
}
module.exports=Highlighter;
