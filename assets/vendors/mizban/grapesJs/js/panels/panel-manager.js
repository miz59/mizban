import { breakPoints } from "../../../commands/variables.js";
import { formatHtmlCode, formatCssCode } from "./functions/monaco-clean-code.js";
import { codeImportManager } from "./monaco-code-import.js";
import { setupPreviewManager } from "./preview-manager.js";
import { cleanConfirmation } from "./clean-canvas.js";
import { refreshCanvasManager } from "./refresh-canvas.js";
import { saveProject } from "./save-project.js";

class PanelManager {
    constructor(editor) {
        this.editor = editor;
        this.setupMainPanel();
        this.setupDevicePanel();
        this.setupCodeEditorWithFormat();
        this.setupPreview();
        this.setupChangeDir();
        
        const saveProjectOnFile = new saveProject(editor);
        saveProjectOnFile.setupImportCommand();

        const cleanCanvas = new cleanConfirmation(editor);
        cleanCanvas.setupImportCommand();

        const importCode = new codeImportManager(editor);
        importCode.setupImportCommand();

        const refreshCanvas = new refreshCanvasManager(editor);
        refreshCanvas.setupImportCommand();
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
            this.createSaveButton(),
            this.createRefreshCanvasButton(),
            this.createChangeDirButton(),
            this.createPreviewButton(),
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
            command: 'clean-canvas'
        };
    }

    createRefreshCanvasButton() {
        return {
            id: 'refresh-canvas',
            className: 'btn-toggle-borders',
            label: '<i class="fa fa-refresh" title="Refresh Canvas"></i>',
            command: 'refresh-canvas-command',
        };
    }

    createPreviewButton() {
        return {
            id: 'preview',
            label: '<i class="fa-solid fa-arrow-up-right-from-square" title="preview"></i>',
            command: 'open-preview'
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

    createSaveButton() {
        return {
            id: 'save-button',
            className: 'fa fa-save',
            command: 'save-project',
            attributes: { title: 'Save Project' }
        };
    }

    createChangeDirButton() {
        return {
            id: 'change-direction',
            className: 'fa fa-exchange',
            command: 'change-direction',
            attributes: { title: 'Change Direction' }
        };
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
                setTimeout(checkAndFormat, 200);
            }
        });
    }

    setupPreview() {
        this.previewManager = setupPreviewManager(this.editor);
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

    createDeviceButton(id, command, active = false, title = '', content) {
        return {
            id,
            className: "btn-toggle-device",
            label: `<i class="txt-subtitle" title="${title}">${content}</i>`,
            command,
            active,
            togglable: false
        };
    }

    createBreakpointButtons() {
        return Object.entries(breakPoints).map(([key, value]) =>
            this.createDeviceButton(
                key,
                `set-device-${key}`,
                true,
                `${key}:${value}`,
                `${key}`
            )
        );
    }

    setupChangeDir() {
        this.editor.Commands.add('change-direction', {
            run: (editor) => {
                const grapesJsCanvas = editor.Canvas.getFrameEl();
                const bodyGrapesJsIframe= grapesJsCanvas.contentDocument.querySelector('body');
                const canvasDirection = bodyGrapesJsIframe.getAttribute('dir');

                if(canvasDirection === 'rtl'){
                    bodyGrapesJsIframe.setAttribute('dir', 'ltr');
                } else if (canvasDirection === 'ltr') {
                    bodyGrapesJsIframe.setAttribute('dir', 'rtl');
                } else {
                    const docDir = document.documentElement.getAttribute('dir');
                    bodyGrapesJsIframe.setAttribute('dir', `${docDir}`);
                }
            }
        });
    }
}

function editor_panelManager(editor) {
    new PanelManager(editor);
}

export { editor_panelManager };