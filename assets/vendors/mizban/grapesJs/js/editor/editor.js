import { setupAssetsManager, editor_panelManager, code_editor, plugins } from "../../Controller.js";
import { initializeWidgets } from '../widget/widget-setup.js';
import { refreshCanvasManager } from '../panels/refresh-canvas.js';
import { device_Manager } from "../devices/device-manager.js";

let path = window.location.pathname;
path = path.replace(/^\/+/, '');
if (path.endsWith('/')) {
    path += 'index.html';
}
path = path.replace(/\.html$/, '');
const pageId = path.replace(/[\/\.]/g, '_');
const storageKey = `gjs_html_${pageId}`;

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
        },
    });

    editor.setComponents(cleanHtml);
    editor.setStyle(content.css);

    const refreshManager = new refreshCanvasManager(editor);
    refreshManager.setupImportCommand();

    window.editor = editor;

    window.isMonacoActive = true;

    editor.on('load', () => {
        const iframe = editor.Canvas.getFrameEl();
        const mizchin = document.createElement('script');
        mizchin.src = '/assets/js/mizchin.min.js';
        const mizCss = document.createElement('link');
        mizCss.rel = 'stylesheet';
        mizCss.href = '/assets/css/miz.min.css';
        const customCssGrapesJs = document.createElement('link');
        customCssGrapesJs.rel = 'stylesheet';
        customCssGrapesJs.href = '/assets/vendors/mizban/grapesJs/css/custom-grapesJs.css';
        const fontawesomeIcon = document.createElement('link');
        fontawesomeIcon.rel = 'stylesheet';
        fontawesomeIcon.href = '/assets/icons/fontawesome/css/all.min.css';
        const customStyle = document.createElement('link');
        customStyle.rel = 'stylesheet';
        customStyle.href = '/assets/css/style.min.css';

        iframe.contentDocument.body.appendChild(mizchin);
        iframe.contentDocument.head.appendChild(mizCss);
        iframe.contentDocument.head.appendChild(fontawesomeIcon);
        iframe.contentDocument.head.appendChild(customStyle);
        iframe.contentDocument.head.appendChild(customCssGrapesJs);


        if (document.dir == 'rtl'){
            document.dir = 'ltr';
            const wrapper = iframe.contentDocument.querySelector("div[data-gjs-type='wrapper']");
            wrapper.dir = 'rtl';
        }


        setTimeout(() => {
            editor.runCommand('open-blocks');
            const blocksButton = editor.Panels.getButton('views', 'open-blocks');
            if (blocksButton) {
                blocksButton.set('active', true);
            }
        }, 300);

        device_Manager(editor);
        setupAssetsManager(editor);
        editor_panelManager(editor);
        code_editor(editor);
        initializeWidgets(editor);
    });


    editor.on('asset:remove', (asset) => {
        const src = asset.get('src');
        localStorage.removeItem(src);
    });

    editor.on('component:selected', () => {
        window.isMonacoActive = false;
    });

    editor.on('component:add', (component) => {
        const currentId = component.getId();
        component.setId(`${currentId}`);
    });
}

initEditor();