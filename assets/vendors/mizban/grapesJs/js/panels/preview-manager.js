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
            run: () => {
                this.openPreview();
            }
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
        try {
            const htmlCode = this.getHtmlCode();
            const cssCode = this.getCssCode();
            const timestamp = Date.now();

            // ⛳ ذخیره محتوا در localStorage با tabId یکتا قبل از باز کردن پنجره
            localStorage.setItem(`previewHtml-${this.tabId}`, htmlCode);
            localStorage.setItem(`previewCss-${this.tabId}`, cssCode);
            localStorage.setItem(`previewTimestamp-${this.tabId}`, timestamp);

            // ساخت URL preview با tabId
            let previewUrl = window.location.pathname;
            if (previewUrl === '/' || previewUrl === '') {
                previewUrl = '/index.html';
            }

            const params = new URLSearchParams(window.location.search);
            params.set('preview', 'true');
            params.set('previewId', this.tabId); // tabId به عنوان previewId عمل می‌کند

            const fullUrl = previewUrl + '?' + params.toString();

            // باز کردن پنجره preview
            const previewWindowName = 'preview_' + this.tabId;
            this.previewWindow = window.open(fullUrl, previewWindowName);

            if (this.previewWindow) {
                this.previewWindow.focus();

                const sendData = () => {
                    const win = this.previewWindow;
                    const doc = win.document;

                    doc.body.innerHTML = '<div id="previewContent"></div><style id="previewCss"></style>';

                    // اسکریپت تزریقی برای دریافت داده از localStorage و postMessage
                    const previewScript = doc.createElement('script');
                    previewScript.innerHTML = `
    (function(){
        function getPreviewIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('previewId');
        }
        const previewId = getPreviewIdFromUrl();

        function updatePreviewFromStorage() {
            const html = localStorage.getItem('previewHtml-' + previewId) || '';
            const css = localStorage.getItem('previewCss-' + previewId) || '';
            const contentEl = document.getElementById('previewContent');
            const cssEl = document.getElementById('previewCss');
            if (contentEl && cssEl) {
                contentEl.innerHTML = html;
                cssEl.textContent = css;
            }
        }

        updatePreviewFromStorage();

        window.addEventListener('message', function(event) {
            if (
                event.data &&
                event.data.type === 'UPDATE_PREVIEW' &&
                event.data.previewId === previewId
            ) {
                const contentEl = document.getElementById('previewContent');
                const cssEl = document.getElementById('previewCss');
                if (contentEl && cssEl) {
                    contentEl.innerHTML = event.data.html;
                    cssEl.textContent = event.data.css;
                }
            }
        });
    })();
                    `;
                    doc.body.appendChild(previewScript);

                    // لود اسکریپت mizchin فقط یک بار
                    setTimeout(() => {
                        // const alreadyLoaded = !!win.Accordion || doc.querySelector('script[src*="/assets/js/mizchin.min.js"]');
                        const alreadyLoaded = doc.querySelector('script[src*="/assets/js/mizchin.min.js"]');
                        if (!alreadyLoaded) {
                            const mizchinScript = doc.createElement('script');
                            mizchinScript.src = '/assets/js/mizchin.min.js';
                            doc.body.appendChild(mizchinScript);
                        }
                    }, 150);

                    // بعد از تزریق، ارسال پیام postMessage برای اطمینان از بروز رسانی
                    setTimeout(() => {
                        this.previewWindow?.postMessage({
                            type: 'UPDATE_PREVIEW',
                            previewId: this.tabId,
                            html: this.getHtmlCode(),
                            css: this.getCssCode(),
                            timestamp: Date.now()
                        }, '*');
                    }, 100);
                };

                // ارسال داده‌ها پس از بارگذاری پنجره
                this.previewWindow.onload = sendData;

                // fallback در صورت عدم فعال شدن onload
                let tries = 0;
                const interval = setInterval(() => {
                    if (this.previewWindow.document?.readyState === 'complete') {
                        sendData();
                        clearInterval(interval);
                    }
                    if (++tries > 10) clearInterval(interval);
                }, 300);
            } else {
                throw new Error('Popup blocked by browser');
            }
        } catch (error) {
            console.error('Preview error:', error);
            this.showPreviewError('Error opening preview: ' + error.message);
        }
    }

    updatePreviewContent(htmlCode, cssCode) {
        try {
            const timestamp = Date.now();

            // بروزرسانی در localStorage
            localStorage.setItem(`previewHtml-${this.tabId}`, htmlCode);
            localStorage.setItem(`previewCss-${this.tabId}`, cssCode);
            localStorage.setItem(`previewTimestamp-${this.tabId}`, timestamp);

            if (this.previewWindow && !this.previewWindow.closed) {
                this.previewWindow.postMessage({
                    type: 'UPDATE_PREVIEW',
                    previewId: this.tabId,
                    html: htmlCode,
                    css: cssCode,
                    timestamp
                }, '*');
            }
        } catch (error) {
            console.error('Error updating preview content:', error);
        }
    }

    getHtmlCode() {
        try {
            if (window.monacoEditor?.getValue) {
                const htmlValue = window.monacoEditor.getValue();
                if (htmlValue.trim()) return htmlValue;
            }
        } catch (error) {
            console.warn('Error getting Monaco HTML content:', error);
        }
        return this.editor.getHtml();
    }

    getCssCode() {
        try {
            if (window.cssMonacoContainer?.getValue) {
                const cssValue = window.cssMonacoContainer.getValue();
                if (cssValue.trim()) return cssValue;
            }
        } catch (error) {
            console.warn('Error getting Monaco CSS content:', error);
        }
        return this.editor.getCss();
    }

//     createFullHtml(htmlCode, cssCode) {
//         const cleanHtml = this.cleanGrapesJSEvents(htmlCode);

//         return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Preview - MIZBAN</title>
//     <link rel="stylesheet" href="../../css/miz.min.css" />
//     <link rel="stylesheet" href="../../css/style.min.css" />
//     <link rel="stylesheet" href="../../css/style.css" />
//     <link rel="stylesheet" href="../../icons/fontawesome/css/all.min.css" />
//     <style>${cssCode}</style>
// </head>
// <body>
//     ${cleanHtml}
//     <script src="../../js/mizchin.js"></script>
// </body>
// </html>`;
//     }

    cleanGrapesJSEvents(html) {
        let cleanHtml = html;
        cleanHtml = cleanHtml.replace(/data-gjs-[^=]*="[^"]*"/g, '');
        cleanHtml = cleanHtml.replace(/\s*gjs-[^\s"]*/g, '');
        cleanHtml = cleanHtml.replace(/id="gjs-[^"]*"/g, '');
        cleanHtml = cleanHtml.replace(/\s*on\w+="[^"]*"/g, '');
        cleanHtml = cleanHtml.replace(/style="[^"]*gjs-[^"]*"/g, 'style=""');
        cleanHtml = cleanHtml.replace(/style="\s*"/g, '');
        return cleanHtml;
    }

    showPreviewError(message) {
        this.editor.Modal.open({
            title: 'Preview Error',
            content: `<div style="color: #ff6b6b; padding: 20px;">
                <i class="fa fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>`
        });
    }

    // closePreview() {
    //     if (this.previewWindow && !this.previewWindow.closed) {
    //         this.previewWindow.close();
    //         this.previewWindow = null;
    //     }
    // }
}

// راه‌اندازی
function setupPreviewManager(editor) {
    const previewManager = new PreviewManager(editor);
    window.previewManager = previewManager;
    return previewManager;
}

export { setupPreviewManager };