import { editor_assetsManager, setupAssetsManager, editor_panelManager, code_editor, plugins } from "../../Controller.js";
import { initializeWidgets } from '../widget/widget-setup.js';

const editor = grapesjs.init({
    container: "#canvas",
    fromElement: true,
    height: "100vh",
    draggable: true,
    plugins: plugins,
    selectorManager: { componentFirst: true },
    storageManager: true,
});

editor_assetsManager(editor);
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