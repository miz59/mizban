class PreviewManager {
    constructor(editor) {
        this.editor = editor;
        this.previewWindow = null;

        if (!sessionStorage.getItem('tabId')) {
            const newTabId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            sessionStorage.setItem('tabId', newTabId);
        }
        this.tabId = sessionStorage.getItem('tabId');

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
        const timestamp = Date.now();

        localStorage.setItem(`previewHtml-${this.tabId}`, htmlCode);
        localStorage.setItem(`previewCss-${this.tabId}`, cssCode);
        localStorage.setItem(`previewTimestamp-${this.tabId}`, timestamp);

        let previewUrl = window.location.pathname;
        if (previewUrl === '/' || previewUrl === '') previewUrl = '/index.html';

        const params = new URLSearchParams(window.location.search);
        params.set('preview', 'true');
        params.set('previewId', this.tabId);

        const fullUrl = previewUrl + '?' + params.toString();
        this.previewWindow = window.open(fullUrl, 'preview_' + this.tabId);

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

            const iframe = doc.createElement('iframe');
            iframe.id = 'preview-canvas';
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.boder = "none";
            doc.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow.document;
            const html = localStorage.getItem('previewHtml-' + this.tabId) || '';
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                    </head>
                    <body>
                    </body>
                </html>`);
            iframeDoc.close();

            setTimeout(() => {
                let mizCss = iframeDoc.createElement("link");
                mizCss.href = "./assets/css/miz.min.css";
                mizCss.rel = "stylesheet";

                let mizchin = iframeDoc.createElement("script");
                mizchin.src = "./assets/js/mizchin.min.js";
                mizchin.async = true;

                iframeDoc.head.appendChild(mizCss);
                iframeDoc.body.innerHTML = html;
                iframeDoc.body.appendChild(mizchin);
            }, 100);
        };

        this.previewWindow.onload = sendData;


        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {

            } else {
                sendData()
            }
        });


    }

    updatePreviewContent(htmlCode, cssCode) {
        const timestamp = Date.now();
        localStorage.setItem(`previewHtml-${this.tabId}`, htmlCode);
        localStorage.setItem(`previewCss-${this.tabId}`, cssCode);
        localStorage.setItem(`previewTimestamp-${this.tabId}`, timestamp);

        if (!this.previewWindow || this.previewWindow.closed) return;

        this.previewWindow.postMessage({
            type: 'UPDATE_PREVIEW',
            previewId: this.tabId,
            html: htmlCode,
            css: cssCode,
            timestamp
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

function setupPreviewManager(editor) {
    const previewManager = new PreviewManager(editor);
    window.previewManager = previewManager;
    return previewManager;
}

export { setupPreviewManager };