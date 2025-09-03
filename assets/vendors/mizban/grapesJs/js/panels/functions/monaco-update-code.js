import { formatHtmlCode, formatCssCode } from './monaco-clean-code.js';
function updateEditor(mainEditor) {
    const htmlCode = mainEditor.getHtml();
    const cssCode = mainEditor.getCss();
    
    // ذخیره موقعیت cursor قبل از آپدیت
    let htmlPosition = null;
    let cssPosition = null;
    
    if (window.monacoEditor) {
        htmlPosition = window.monacoEditor.getPosition();
        window.monacoEditor.setValue(htmlCode);
    }
    if (window.htmlOnlyEditor) {
        htmlPosition = window.htmlOnlyEditor.getPosition();
        window.htmlOnlyEditor.setValue(htmlCode);
    }
    
    if (window.cssMonacoContainer) {
        cssPosition = window.cssMonacoContainer.getPosition();
        window.cssMonacoContainer.setValue(cssCode);
    }
    if (window.cssOnlyEditor) {
        cssPosition = window.cssOnlyEditor.getPosition();
        window.cssOnlyEditor.setValue(cssCode);
    }
    
    // برگرداندن موقعیت cursor بعد از آپدیت
    setTimeout(() => {
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
    }, 0);
}

function updateEditorWithFormat() {
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
    
    // برگرداندن موقعیت cursor بعد از آپدیت
    setTimeout(() => {
        if (window.monacoEditor && htmlPosition) {
            try {
                window.monacoEditor.setPosition(htmlPosition);
            } catch (e) {
                // اگر خط خارج از محدوده باشد، به خط آخر برو
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
    }, 0);
}

export { updateEditor, updateEditorWithFormat }; 