import { base_component } from "./js/components/base-components.js";
import { base_blocks } from "./js/plugins/base-blocks.js";
import { flexColBlock } from "./js/plugins/customize-block.js";
import { setupAssetsManager } from "./js/assetsManager/assets-manager.js";
import { cssRules } from "./js/cssRules/cssRules.js";
import { editor_panelManager } from "./js/panels/panel-manager.js";
import { code_editor } from "./js/panels/editor-setup.js";
import { editor_events } from "./js/events/editor-events.Js";

function removeId(editor) {
    grapesjs.plugins.add('remove-id-plugin', (editor) => {
        editor.on('component:add', (component) => {
            component.removeAttributes('id');
        });
    })
}


const plugins = [removeId, base_blocks, base_component, cssRules, editor_events, flexColBlock];



export { plugins, editor_panelManager, setupAssetsManager, code_editor };