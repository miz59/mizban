import { updateEditorWithFormat } from './functions/monaco-update-code.js';
class HtmlImportManager {
    constructor(editor, codeViewer, modal, container, btnEdit) {
        this.editor = editor;
        this.codeViewer = codeViewer;
        this.modal = modal;
        this.container = container;
        this.btnEdit = btnEdit;
        this.setupImportButton();
        this.setupImportCommand();
    }

    setupImportButton() {
        this.btnEdit.onclick = () => this.handleImport();
    }

    handleImport() {
        const code = this.codeViewer.editor.getValue();
        this.editor.DomComponents.getWrapper().set('content', '');
        this.editor.setComponents(code.trim());
        this.modal.close();
    }

    setupImportCommand() {
        this.editor.Commands.add('html-import', {
            run: (editor, sender) => {
                sender && sender.set('active', 0);
                this.showImportModal();
            }
        });
    }

    showImportModal() {
        let viewer = this.codeViewer.editor;
        this.modal.setTitle('Edit code');
        
        if (!viewer) {
            const txtarea = document.createElement('textarea');
            this.container.append(txtarea, this.btnEdit);
            this.codeViewer.init(txtarea);
            viewer = this.codeViewer.editor;
        }

        this.modal.setContent('');
        this.modal.setContent(this.container);
        this.codeViewer.setContent(this.editor.getHtml());
        this.modal.open();
        viewer.refresh();
    }
}

class CodeImportManager {
    constructor(editor) {
        this.editor = editor;
        this.setupImportCommand();
    }

    setupImportCommand() {
        this.editor.Commands.add('import-code-from-html', {
            run: () => {
                this.editor.addComponents(this.editor.config.components);
                
                const updateMonacoEditors = () => {
                    updateEditorWithFormat(this.editor);
                };
                
                updateMonacoEditors();
                setTimeout(updateMonacoEditors, 100);
                setTimeout(updateMonacoEditors, 500);
            }
        });
    }
}

function setupHtmlImportCommand(editor, codeViewer, modal, container, btnEdit) {
    new HtmlImportManager(editor, codeViewer, modal, container, btnEdit);
}

function setupImportCodeFromHtmlCommand(editor) {
    new CodeImportManager(editor);
}

export { setupHtmlImportCommand, setupImportCodeFromHtmlCommand };