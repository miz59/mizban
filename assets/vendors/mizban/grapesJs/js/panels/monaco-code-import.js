import { updateEditorWithFormat } from './functions/monaco-update-code.js';
class codeImportManager {
    constructor(editor) {
        this.editor = editor;
        this.setupImportCommand();
    }

    setupImportCommand() {
        this.editor.Commands.add('import-code-from-html', {
            run: async () => this.importCommand(await this.resolveSourceHtml())
        });
    }

    async resolveSourceHtml() {
        const url = window.location.href;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load HTML file');
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        return doc.body.innerHTML;
    }

    importCommand(bodyHtml) {
        this.editor.addComponents(bodyHtml);

        const updateMonacoEditors = () => {
            updateEditorWithFormat(this.editor);
        };

        updateMonacoEditors();
        setTimeout(updateMonacoEditors, 100);
        setTimeout(updateMonacoEditors, 500);
    }
}
export { codeImportManager };