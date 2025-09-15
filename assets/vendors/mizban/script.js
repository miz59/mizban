(function () {
    if (!document.head.querySelector(`link[href*="/miz.min.css"]`)) {
        console.error('You need to include the miz.min.css file');
        return;
    }

    const body = document.body;
    const head = document.head;

    function hasPreviewParam() {
        return window.location.search.includes('preview=true');
    }

    function wrapBodyContent() {
        const scriptTag = document.querySelector(`script[src*="/assets/vendors/mizban/script.js"]`);
        if (!scriptTag) {
            console.error('No script tag found for wrapping body content.');
            return null;
        }

        if (!document.getElementById('canvas')) {
            const canvasDiv = document.createElement('div');
            canvasDiv.id = 'canvas';

            while (body.firstChild) {
                canvasDiv.appendChild(body.firstChild);
            }

            body.appendChild(canvasDiv);
        }

        return document.getElementById('canvas');
    }

    function addStyles() {
        if (hasPreviewParam()) return;

        const styles = [
            '/assets/vendors/mizban/grapesJs/css/grapesJs.css',
            '/assets/vendors/mizban/grapesJs/css/monaco-editor.css',
            '/assets/vendors/mizban/grapesJs/css/custom-grapesJs.css',
        ];

        styles.forEach(href => {
            if (!document.head.querySelector(`link[href*="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                head.appendChild(link);
            }
        });
    }

    function addScripts() {
        if (hasPreviewParam()) {
            const previewManager = document.createElement('script');
            previewManager.src = '/assets/vendors/mizban/grapesJs/js/panels/preview-manager.js';
            previewManager.type = 'module';
            body.appendChild(previewManager);

            const script = document.createElement('script');
            script.innerHTML = `
            import { setupPreviewManager , setContentPreview } from '/assets/vendors/mizban/grapesJs/js/panels/preview-manager.js';
            (function() {
                const params = new URLSearchParams(window.location.search);
                if (params.get('preview') !== 'true') return;
                const doc = document;
                setContentPreview(doc);
            })();
            `;
            script.type = 'module';

            previewManager.onload = () => {
                body.appendChild(script);
            };
            return;
        }

        const scripts = [
            { src: '/assets/js/mizchin.min.js' },
            { src: '/assets/vendors/mizban/grapesJs/grapesJs.js', type: 'module' },
            { src: '/assets/vendors/mizban/grapesJs/js/editor/editor.js', type: 'module' },
            { src: '/assets/vendors/mizban/playground/vs/loader.min.js', type: 'text/javascript' },
            { src: '/assets/vendors/mizban/grapesJs/js/assetsManager/assets-manager.js', type: 'module' },

        ];

        let chain = Promise.resolve();

        scripts.forEach(scriptData => {
            chain = chain.then(() => new Promise(resolve => {
                if (document.querySelector(`script[src*="${scriptData.src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = scriptData.src;
                if (scriptData.type) script.type = scriptData.type;
                script.onload = resolve;
                body.appendChild(script);
            }));
        });
    }

    const canvasDiv = wrapBodyContent();
    if (!canvasDiv) return;

    addStyles();
    addScripts();
})();