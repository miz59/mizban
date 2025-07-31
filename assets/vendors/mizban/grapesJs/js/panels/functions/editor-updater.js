import { formatHtmlCode, formatCssCode } from './clean-code.js';
function updateEditor(mainEditor) {
    const htmlCode = mainEditor.getHtml();
    const cssCode = mainEditor.getCss();
    
    if (window.monacoEditor) window.monacoEditor.setValue(htmlCode);
    if (window.htmlOnlyEditor) window.htmlOnlyEditor.setValue(htmlCode);
    
    if (window.cssMonacoContainer) window.cssMonacoContainer.setValue(cssCode);
    if (window.cssOnlyEditor) window.cssOnlyEditor.setValue(cssCode);
}

function updateEditorWithFormat(mainEditor) {
    const htmlCode = mainEditor.getHtml();
    const cssCode = mainEditor.getCss();
    const formattedHtml = formatHtmlCode(htmlCode);
    const formattedCss = formatCssCode(cssCode);
    
    if (window.monacoEditor) window.monacoEditor.setValue(formattedHtml);
    if (window.htmlOnlyEditor) window.htmlOnlyEditor.setValue(formattedHtml);
    
    if (window.cssMonacoContainer) window.cssMonacoContainer.setValue(formattedCss);
    if (window.cssOnlyEditor) window.cssOnlyEditor.setValue(formattedCss);
}

export { updateEditor, updateEditorWithFormat }; 