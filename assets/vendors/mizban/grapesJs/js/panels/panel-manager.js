import { breakPoints } from "../../../commands/variables.js";
import { formatHtmlCode, formatCssCode } from "./functions/clean-code.js";

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
        this.setupCodeEditorWithFormat();
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
            this.createButton('codeEditor', 'fa fa-code', 'code-editor-with-format', 'code editor'),
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
        // Create a separate modal container to avoid conflicts with code editor
        const modalContainer = document.createElement('div');
        modalContainer.className = 'gjs-mdl-container gjs-mdl-dialog gjs-one-bg gjs-two-color delete-confirmation-modal position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black-50';
        modalContainer.style.cssText = 'background: rgba(0,0,0,0.5); z-index: 9999; max-width:100%;';
        const modalDialog = document.createElement('div');
        modalDialog.className = 'gjs-mdl-content bg-disabled-dark-color on-primary-color p-2 radius-all-small';
        
        const title = document.createElement('h3');
        title.textContent = 'Delete output';
        title.style.cssText = 'margin: 0 0 15px 0; color: #fff;';
        
        const content = document.createElement('div');
        content.innerHTML = this.getCleanConfirmationContent();
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center gap-2 mt-2';
        
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.className = 'on-primary-color border-style-none radius-all-small px-2 py-1 cursor-pointer bg-disabled-regular-color';
        noButton.setAttribute('id', 'noDeleteCode');
        noButton.onclick = () => {
            document.body.removeChild(modalContainer);
        };
        
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.className = 'on-primary-color border-style-none radius-all-small px-2 py-1 cursor-pointer bg-danger-regular-color';
        yesButton.setAttribute('id', 'yesDeleteCode');
        yesButton.onclick = () => {
            editor.runCommand('core:canvas-clear');
            document.body.removeChild(modalContainer);
        };
        
        buttonContainer.appendChild(noButton);
        buttonContainer.appendChild(yesButton);
        
        modalDialog.appendChild(title);
        modalDialog.appendChild(content);
        modalDialog.appendChild(buttonContainer);
        modalContainer.appendChild(modalDialog);
        
        // Add click outside to close
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
        
        document.body.appendChild(modalContainer);
    }

    showAboutModal(editor) {
        editor.Modal.open({
            title: 'about Miz',
            attributes: { class: 'my-small-modal' },
            content: this.getAboutContent()
        });
    }

    setupCodeEditorWithFormat() {
        this.editor.Commands.add('code-editor-with-format', {
            run: (editor) => {
                editor.runCommand('code-editor');
                
                // Wait for Monaco editors to be fully initialized
                const checkAndFormat = () => {
                    if (window.monacoEditor && window.cssMonacoContainer) {
                        try {
                            const htmlCode = window.monacoEditor.getValue();
                            const formattedHtml = formatHtmlCode(htmlCode);
                            window.monacoEditor.setValue(formattedHtml);
                            
                            const cssCode = window.cssMonacoContainer.getValue();
                            const formattedCss = formatCssCode(cssCode);
                            window.cssMonacoContainer.setValue(formattedCss);
                        } catch (error) {
                            console.log('Monaco editors not ready yet, retrying...');
                            setTimeout(checkAndFormat, 50);
                        }
                    } else {
                        setTimeout(checkAndFormat, 50);
                    }
                };
                
                // Start checking after a short delay
                setTimeout(checkAndFormat, 200);
            }
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