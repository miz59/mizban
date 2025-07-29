import { setupHtmlImportCommand, setupImportCodeFromHtmlCommand } from './code-import-manager.js';
import { setupCodeEditorCommand } from './customize/monaco-editor.js';

class EditorContainer {
    constructor() {
        this.container = this.createContainer();
        this.monacoContainer = this.createMonacoContainer();
        this.cssMonacoContainer = this.createCssMonacoContainer();
        this.resizer = this.createResizer();
        this.containerResizer = this.createContainerResizer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'editorContainer';
        return container;
    }

    createMonacoContainer() {
        const container = document.createElement('div');
        container.id = 'editor';
        return container;
    }

    createCssMonacoContainer() {
        const container = document.createElement('div');
        container.id = 'cssEditor';
        return container;
    }

    createResizer() {
        const resizer = document.createElement('div');
        resizer.id = 'resizer';
        return resizer;
    }

    createContainerResizer() {
        const resizer = document.createElement('div');
        resizer.id = 'containerResizer';
        return resizer;
    }

    appendElements() {
        this.container.append(
            this.monacoContainer,
            this.resizer,
            this.cssMonacoContainer,
            this.containerResizer
        );
    }
}

class CodeViewer {
    constructor(editor) {
        this.editor = editor;
        this.codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
        this.setupCodeViewer();
    }

    setupCodeViewer() {
        this.codeViewer.set({
            codeName: 'htmlmixed',
            readOnly: 0,
            theme: 'hopscotch',
            autoBeautify: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            styleActiveLine: true,
            smartIndent: true,
            indentWithTabs: true,
        });
    }

    getViewer() {
        return this.codeViewer;
    }
}

class ImportButton {
    constructor(editor) {
        this.pfx = editor.getConfig().stylePrefix;
        this.button = this.createButton();
    }

    createButton() {
        const btn = document.createElement('button');
        btn.innerHTML = 'Import';
        btn.className = `${this.pfx}btn-prim ${this.pfx}btn-import`;
        return btn;
    }

    getButton() {
        return this.button;
    }
}

function code_editor(editor) {
    // ایجاد کانتینرها
    const editorContainer = new EditorContainer();
    editorContainer.appendElements();

    // ایجاد کد ویور
    const codeViewer = new CodeViewer(editor);

    // ایجاد دکمه ایمپورت
    const importButton = new ImportButton(editor);

    // تنظیم دستورات
    setupHtmlImportCommand(
        editor,
        codeViewer.getViewer(),
        editor.Modal,
        editorContainer.container,
        importButton.getButton()
    );

    setupCodeEditorCommand(
        editor,
        editor.Modal,
        editorContainer.container,
        editorContainer.monacoContainer,
        editorContainer.resizer,
        editorContainer.cssMonacoContainer
    );

    setupImportCodeFromHtmlCommand(editor);
}

export { code_editor };
