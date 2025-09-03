import { setupAssetsManager, editor_panelManager, code_editor, plugins } from "../../Controller.js";
import { initializeWidgets } from '../widget/widget-setup.js';
import { refreshCanvasManager } from '../panels/refresh-canvas.js';

let filename = window.location.pathname.split('/').pop();
if (!filename) filename = 'index.html';
const pageId = filename.replace(/\./g, '_');
const storageKey = `gjs_${pageId}`;

let editor;

export function initEditor(content = { html: '', css: '' }) {
    if (editor) {
        editor.destroy();
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content.html;

    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    const cleanHtml = tempDiv.innerHTML;

    editor = grapesjs.init({
        container: '#canvas',
        fromElement: true,
        height: '100vh',
        plugins: plugins,
        selectorManager: { componentFirst: true },
        storageManager: {
            type: 'local',
            options: {
                local: {
                    autosave: true,
                    autoload: true,
                    stepsBeforeSave: 1,
                    key: storageKey,
                }
            },
        },
        assetManager: {
            assets: [],
            upload: '/upload-assets',
            uploadName: 'file',
            autoAdd: true,
            dropzone: true,
            multiUpload: true,
            multiUploadSuffix: ''
        },
        layerManager: {
            sortable: true,
        }
    });

    editor.setComponents(cleanHtml);
    editor.setStyle(content.css);

    const refreshManager = new refreshCanvasManager(editor);
    refreshManager.setupImportCommand();

    editor.on('canvas:frame:load', () => {
        setTimeout(() => {
            const iframe = editor.Canvas.getFrameEl();
            const script = document.createElement('script');
            script.src = '/assets/js/mizchin.min.js';
            iframe.contentDocument.body.appendChild(script);

            script.onload = () => {
                if (iframe.contentWindow.MizchinInit) {
                    iframe.contentWindow.MizchinInit();
                }
            };
        }, 1000);
    });

    window.editor = editor;

    setupAssetsManager(editor);
    editor_panelManager(editor);
    code_editor(editor);
    initializeWidgets(editor);

    editor.on('load', () => {
        setTimeout(() => {
            editor.runCommand('open-blocks');
            const blocksButton = editor.Panels.getButton('views', 'open-blocks');
            if (blocksButton) {
                blocksButton.set('active', true);
            }
        }, 300);
        editor.runCommand('change-direction');
    });

    editor.on('asset:remove', (asset) => {
        const src = asset.get('src');
        localStorage.removeItem(src);
    });
}

initEditor();