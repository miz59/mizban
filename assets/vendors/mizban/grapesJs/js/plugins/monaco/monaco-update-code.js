import { formatHtmlCode, formatCssCode } from './monaco-clean-code.js';


function updateEditorWithFormat() {
    if(window.isMonacoActive){
        return;
    }
    const htmlCode = editor.getHtml();
    const cssCode = editor.getCss();
    const formattedHtml = formatHtmlCode(htmlCode);
    const formattedCss = formatCssCode(cssCode);

    let htmlPosition = null;
    let cssPosition = null;


    if (window.monacoEditor) {
        htmlPosition = window.monacoEditor.getPosition();
        window.monacoEditor.setValue(formattedHtml);
    }
    if (window.htmlOnlyEditor) {
        htmlPosition = window.htmlOnlyEditor.getPosition();
        window.htmlOnlyEditor.setValue(formattedHtml);
    }

    if (window.cssMonacoContainer) {
        cssPosition = window.cssMonacoContainer.getPosition();
        window.cssMonacoContainer.setValue(formattedCss);
    }
    if (window.cssOnlyEditor) {
        cssPosition = window.cssOnlyEditor.getPosition();
        window.cssOnlyEditor.setValue(formattedCss);
    }




    if (window.monacoEditor && htmlPosition) {
        try {
            window.monacoEditor.setPosition(htmlPosition);
        } catch (e) {
            const lineCount = window.monacoEditor.getModel().getLineCount();
            window.monacoEditor.setPosition({ lineNumber: lineCount, column: 1 });
        }
    }
    if (window.htmlOnlyEditor && htmlPosition) {
        try {
            window.htmlOnlyEditor.setPosition(htmlPosition);
        } catch (e) {
            const lineCount = window.htmlOnlyEditor.getModel().getLineCount();
            window.htmlOnlyEditor.setPosition({ lineNumber: lineCount, column: 1 });
        }
    }
    if (window.cssMonacoContainer && cssPosition) {
        try {
            window.cssMonacoContainer.setPosition(cssPosition);
        } catch (e) {
            const lineCount = window.cssMonacoContainer.getModel().getLineCount();
            window.cssMonacoContainer.setPosition({ lineNumber: lineCount, column: 1 });
        }
    }
    if (window.cssOnlyEditor && cssPosition) {
        try {
            window.cssOnlyEditor.setPosition(cssPosition);
        } catch (e) {
            const lineCount = window.cssOnlyEditor.getModel().getLineCount();
            window.cssOnlyEditor.setPosition({ lineNumber: lineCount, column: 1 });
        }
    }
}

export {updateEditorWithFormat }; 