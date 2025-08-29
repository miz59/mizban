import { config } from "../../../../../../miz/themes/scripts.js";

class PreviewManager {
    constructor(editor) {
        this.editor = editor;
        this.previewWindow = null;

        let filename = window.location.pathname.split('/').pop();
        if (!filename) filename = 'index.html';
        this.pageId = filename.replace(/\.[^/.]+$/, '');
        this.storageKey = `preview_${this.pageId}`;

        this.setupPreviewCommand();
        this.setupAutoPreviewUpdate();
    }

    setupPreviewCommand() {
        this.editor.Commands.add('open-preview', {
            run: () => this.openPreview()
        });
    }

    setupAutoPreviewUpdate() {
        this.editor.on('change', () => {
            this.updatePreviewContent(this.getHtmlCode(), this.getCssCode());
        });

        if (window.monacoEditor?.onDidChangeModelContent) {
            window.monacoEditor.onDidChangeModelContent(() => {
                this.updatePreviewContent(this.getHtmlCode(), this.getCssCode());
            });
        }

        if (window.cssMonacoContainer?.onDidChangeModelContent) {
            window.cssMonacoContainer.onDidChangeModelContent(() => {
                this.updatePreviewContent(this.getHtmlCode(), this.getCssCode());
            });
        }
    }

    openPreview() {
        const htmlCode = this.getHtmlCode();
        const cssCode = this.getCssCode();

        localStorage.setItem(`${this.storageKey}_html`, htmlCode);
        localStorage.setItem(`${this.storageKey}_css`, cssCode);

        let previewUrl = window.location.pathname;
        if (previewUrl === '/' || previewUrl === '') previewUrl = '/index.html';

        const params = new URLSearchParams(window.location.search);
        params.set('preview', 'true');
        params.set('previewId', this.pageId);

        const fullUrl = previewUrl + '?' + params.toString();
        this.previewWindow = window.open(fullUrl, 'preview_' + this.pageId);

        if (!this.previewWindow) {
            console.error('Popup blocked by browser');
            return;
        }

        this.previewWindow.focus();

        const sendData = () => {
            const win = this.previewWindow;
            const doc = win.document;

            doc.body.innerHTML = "";
            doc.getElementById('preview-canvas')?.remove();

            setContentPreview(doc);
        };

        this.previewWindow.onload = sendData;

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // صفحه برگشت → می‌تونی refresh iframe انجام بدی
            } else {
                sendData();
            }
        });
    }

    updatePreviewContent(htmlCode, cssCode) {
        localStorage.setItem(`${this.storageKey}_html`, htmlCode);
        localStorage.setItem(`${this.storageKey}_css`, cssCode);

        if (!this.previewWindow || this.previewWindow.closed) return;

        this.previewWindow.postMessage({
            type: 'UPDATE_PREVIEW',
            previewId: this.pageId,
            html: htmlCode,
            css: cssCode,
            timestamp: Date.now()
        }, '*');
    }

    getHtmlCode() {
        try {
            if (window.monacoEditor?.getValue) {
                const val = window.monacoEditor.getValue();
                if (val.trim()) return val;
            }
        } catch { }
        return this.editor.getHtml();
    }

    getCssCode() {
        try {
            if (window.cssMonacoContainer?.getValue) {
                const val = window.cssMonacoContainer.getValue();
                if (val.trim()) return val;
            }
        } catch { }
        return this.editor.getCss();
    }
}

function setContentPreview(doc) {
    let filename = window.location.pathname.split('/').pop();
    if (!filename) filename = 'index.html';
    const pageId = filename.replace(/\.[^/.]+$/, '');
    const storageKey = `preview_${pageId}`;

    const html = localStorage.getItem(`${storageKey}_html`) || '';
    const css  = localStorage.getItem(`${storageKey}_css`) || '';

    const iframe = doc.createElement('iframe');
    iframe.id = 'preview-canvas';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    doc.body.innerHTML = '';
    doc.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html><html><head></head><body></body></html>`);
    iframeDoc.close();

    setTimeout(() => {
        let mizCss = iframeDoc.createElement('link');
        mizCss.href = './assets/css/miz.min.css';
        mizCss.rel = 'stylesheet';

        let stylePreview = iframeDoc.createElement('style');
        stylePreview.innerHTML = css;

        let mizchin = iframeDoc.createElement('script');
        mizchin.src = `${config.output}`;
        mizchin.async = true;

        iframeDoc.head.appendChild(mizCss);
        iframeDoc.head.appendChild(stylePreview);
        iframeDoc.body.innerHTML = html;
        iframeDoc.body.appendChild(mizchin);
    }, 100);
}

function setupPreviewManager(editor) {
    const previewManager = new PreviewManager(editor);
    window.previewManager = previewManager;
    return previewManager;
}

export { setupPreviewManager , setContentPreview };