import { breakPoints } from "../../../commands/variables.js";

const breakPointIcons = {
    xxl: 'fa fa-tv',
    xl: 'fa fa-desktop',
    lg: 'fa fa-laptop',
    md: 'fa fa-tablet',
    sm: 'fa fa-mobile',
    xs: 'fa fa-mobile-alt'
};

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
            this.createButton('codeEditor', 'fa fa-code', 'code-editor', 'code editor'),
            this.createButton('importCode', 'fa fa-upload', 'import-code-from-html', 'import code from html'),
            this.createButton('undo', 'fa fa-undo', 'core:undo', 'undo'),
            this.createButton('redo', 'fa fa-rotate-right', 'core:redo', 'redo'),
            this.createButton('clean', 'fa fa-trash', 'core:canvas-clear', 'clean'),
            this.createAboutButton(),
        ];
    }

    createButton(id, icon, command, title) {
        return {
            id,
            className: 'btn-toggle-borders',
            label: `<i class="${icon}" title="${title}"></i>`,
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
                <img src="https://eazymizy.com/assets/media/images/logo.png">
                <p>MIZBAN</p>
                <p class="txt-align-center">Do not start from ZERO. The MIZ framework is here to make front-end development incredibly easy</p>
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
            ...this.createBreakpointButtons()
        ];
    }

    createDeviceButton(id, icon, command, active = false, title = '') {
        return {
            id,
            className: "btn-toggle-device",
            label: `<i class="${icon}" title="${title}"></i>`,
            command,
            active,
            togglable: false
        };
    }
    
    createBreakpointButtons() {
        return Object.entries(breakPoints).map(([key, value]) =>
            this.createDeviceButton(
                key,
                breakPointIcons[key],
                `set-device-${key}`,
                true,
                `${key}:${value}`
            )
        );
    }
}

function editor_panelManager(editor) {
    new PanelManager(editor);
}

export { editor_panelManager };