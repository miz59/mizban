import { breakPoints } from "../../../commands/variables.js";

class PanelManager {
    constructor(editor) {
        this.editor = editor;
        this.setupMainPanel();
        this.setupDevicePanel();
    }

    setupMainPanel() {
        this.editor.Panels.addPanel({
            id: "gjs_pn_buttons",
            el: ".gjs-pn-options",
            buttons: this.getMainPanelButtons()
        });
    }

    getMainPanelButtons() {
        return [
            this.createButton('code-editor', 'fa fa-code', 'code-editor'),
            this.createButton('importCode', 'fa fa-upload', 'import-code-from-html'),
            this.createButton('undo', 'fa fa-undo', 'core:undo'),
            this.createButton('redo', 'fa fa-rotate-right', 'core:redo'),
            this.createButton('clean', 'fa fa-trash', 'core:canvas-clear'),
            this.createAboutButton()
        ];
    }

    createButton(id, icon, command) {
        return {
            id,
            className: 'btn-toggle-borders',
            label: `<i class="${icon}"></i>`,
            command,
            readOnly: 0
        };
    }

    createAboutButton() {
        return {
            id: 'question',
            className: 'btn-toggle-borders',
            label: '<i class="fa fa-question-circle"></i>',
            command: this.showAboutModal.bind(this)
        };
    }

    showAboutModal(editor) {
        editor.Modal.open({
            title: 'about Miz',
            attributes: { class: 'my-small-modal' },
            content: this.getAboutContent()
        });
    }

    getAboutContent() {
        return `
            <div class="modal-question">
                <img src="https://esperlos.ir/wp-content/uploads/2023/07/logo-esperlos.webp">
                <p>GrapesJS Webpage Builder is a simple showcase of what is possible to achieve with the GrapesJS core library.</p>
                <p>For any hint about the demo check the Webpage Preset repository and open an issue. For problems with the builder itself, open an issue on the main GrapesJS repository.</p>
                <p>Being a free and open source project contributors and supporters are extremely welcome. If you like the project support it with a donation of your choice or become a backer/sponsor via Open Collective.</p>
            </div>
        `;
    }

    setupDevicePanel() {
        this.editor.Panels.addPanel({
            id: "device_panel",
            el: ".gjs-pn-commands",
            buttons: this.getDeviceButtons()
        });
    }

    getDeviceButtons() {
        return [
            this.createDeviceButton('desktop', 'fa fa-desktop', 'set-device-desktop', true),
            ...this.createBreakpointButtons()
        ];
    }

    createDeviceButton(id, icon, command, active = false) {
        return {
            id,
            className: "btn-toggle-device",
            label: `<i class="${icon}"></i>`,
            command,
            active,
            togglable: false
        };
    }

    createBreakpointButtons() {
        return Object.keys(breakPoints).map(key => 
            this.createDeviceButton(
                key,
                `<i style="font-size: 1rem">${key}</i>`,
                `set-device-${key}`,
                true
            )
        );
    }
}

function editor_panelManager(editor) {
    new PanelManager(editor);
}

export { editor_panelManager };