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
            this.createCleanButton(),
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

    createCleanButton() {
        return {
            id: 'clean',
            className: 'btn-toggle-borders',
            label: '<i class="fa fa-trash" title="clean"></i>',
            command: this.showCleanConfirmation.bind(this)
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

    showCleanConfirmation(editor) {
        const modal = editor.Modal;
        modal.setTitle('Delete output');
        modal.setContent(this.getCleanConfirmationContent());
        const modalContent = modal.getContentEl();
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 20px;';
        
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.classList.add('on-primary-color', 'border-style-none', 'radius-all-small', 'px-2', 'py-1', 'cursor-pointer', 'bg-disabled-regular-color');
        noButton.setAttribute('id', 'noDeleteCode');
        noButton.onclick = () => modal.close();
        
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.classList.add('on-primary-color', 'border-style-none', 'radius-all-small', 'px-2', 'py-1', 'cursor-pointer', 'bg-danger-regular-color');
        yesButton.setAttribute('id', 'noDeleteCode');
        yesButton.onclick = () => {
            editor.runCommand('core:canvas-clear');
            modal.close();
        };
        
        buttonContainer.appendChild(noButton);
        buttonContainer.appendChild(yesButton);
        modalContent.appendChild(buttonContainer);
        
        modal.open();
    }

    showAboutModal(editor) {
        editor.Modal.open({
            title: 'about Miz',
            attributes: { class: 'my-small-modal' },
            content: this.getAboutContent()
        });
    }

    getCleanConfirmationContent() {
        return `
            <div class="modal-question cursor-pointer">
                <p>Are you sure you want to delete the output you are currently viewing?</p>
                <p style="color: #ff6b6b; font-size: 14px; margin-top: 10px;">This operation cannot be reversed!</p>
            </div>
        `;
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