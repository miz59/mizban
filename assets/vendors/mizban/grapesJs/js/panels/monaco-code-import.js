import { updateEditorWithFormat } from './functions/monaco-update-code.js';
// class HtmlImportManager {
//     constructor(editor, codeViewer, modal, container, btnEdit) {
//         this.editor = editor;
//         this.codeViewer = codeViewer || editor.CodeManager.getViewer('CodeMirror').clone().set({ theme: 'hopscotch', readOnly: 0 });
//         // this.codeViewer = editor.CodeManager.getViewer('CodeMirror').clone().set({ theme: 'hopscotch', readOnly: 0 });

//         // this.modal = modal || editor.Modal;
//         this.modal = editor.Modal;
//         this.container = container || document.createElement('div');

//         this.btnEdit = btnEdit || (() => {
//             const btn = document.createElement('button');
//             btn.innerText = 'ذخیره';
//             btn.classList.add('gjs-btn-prim');
//             return btn;
//         })();

//         this.setupImportButton();
//         this.setupImportCommand();
//     }

//     setupImportButton() {
//         if (!this.btnEdit) {
//             console.error("btnEdit is null or undefined");
//             return;
//         }
//         this.btnEdit.onclick = () => this.handleImport();
//     }

//     handleImport() {
//         const code = this.codeViewer.editor.getValue();
//         this.editor.DomComponents.getWrapper().set('content', '');
//         this.editor.setComponents(code.trim());
//         this.modal.close();
//     }

//     setupImportCommand() {
//         this.editor.Commands.add('html-import', {
//             run: () => this.showImportModal()
//         });
//     }

//     resolveSourceHtml() {
//         const src = this.editor.config.components;
//         let html = typeof src === 'string' ? src : (src || '');

//         // اگر شامل تگ body یا wrapper است، فقط محتوای داخلش رو بگیر
//         const temp = document.createElement('div');
//         temp.innerHTML = html.trim();

//         // اگر تگ body وجود دارد
//         const bodyEl = temp.querySelector('body');
//         if (bodyEl) {
//             return bodyEl.innerHTML.trim();
//         }

//         // اگر div#canvas وجود دارد (مثل grapesjs)
//         const canvasEl = temp.querySelector('#canvas');
//         if (canvasEl) {
//             return canvasEl.innerHTML.trim();
//         }

//         // اگر هیچ‌کدوم نبود همون رو برگردون
//         return html;
//     }


//     showImportModal() {
//         let viewer = this.codeViewer.editor;
//         this.modal.setTitle('Edit code');

//         // اگر ویرایشگر هنوز مقداردهی نشده
//         if (!viewer) {
//             const txtarea = document.createElement('textarea');
//             this.container.appendChild(txtarea);
//             this.codeViewer.init(txtarea); // اینجا editor ساخته میشه
//             viewer = this.codeViewer.editor;

//             if (!this.btnEdit.isConnected) {
//                 this.container.appendChild(this.btnEdit);
//             }
//             this.btnEdit.addEventListener('click', () => this.handleImport());
//         }

//         this.modal.setContent('');
//         this.modal.setContent(this.container);

//         // حالا مقدار داخلی body یا canvas رو بگیر
//         this.codeViewer.setContent(this.resolveSourceHtml());

//         this.modal.open();

//         // دوباره چک کن که viewer ساخته شده
//         if (viewer && typeof viewer.refresh === 'function') {
//             viewer.refresh();
//         }
//     }


// }


class codeImportManager {
    constructor(editor) {
        this.editor = editor;
        this.setupImportCommand();
    }

    setupImportCommand() {
        this.editor.Commands.add('clean-canvas', {
            run: () => this.setupImportCommand()
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

    setupImportCommand() {
        this.editor.Commands.add('import-code-from-html', {
            run: async () => {
                const bodyHtml = await this.resolveSourceHtml();
                this.editor.addComponents(bodyHtml);

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

// function setupHtmlImportCommand(editor, codeViewer, modal, container, btnEdit) {
//     new HtmlImportManager(editor, codeViewer, modal, container, btnEdit);
// }

// function setupImportCodeFromHtmlCommand(editor) {
//     new CodeImportManager(editor);
// }

// export { setupHtmlImportCommand, setupImportCodeFromHtmlCommand };
export { codeImportManager };