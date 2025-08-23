import { setupAssetsManager, editor_panelManager, code_editor, plugins } from "../../Controller.js";
import { initializeWidgets } from '../widget/widget-setup.js';

let filename = window.location.pathname.split('/').pop();
if (!filename) filename = 'index.html';
const pageId = filename.replace(/\./g, '_');
const storageKey = `gjs_${pageId}`;
// const storageKey = `gjs_assets`;
const editor = grapesjs.init({
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
});

editor.on('asset:upload:response', (response) => {
    console.log('Asset uploaded successfully:', response);
});






editor.on('asset:remove', (asset) => {
    const src = asset.get('src');
    console.log('Asset removed:', src);
    // حذف از localStorage
    localStorage.removeItem(src);
});



