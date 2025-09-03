import { initEditor } from '../editor/editor.js';

class refreshCanvasManager {
    constructor(editor) {
        this.editor = editor;
    }

    setupImportCommand(){
        this.editor.Commands.add('refresh-canvas-command', {
            run: () => this.refreshCanvas()
        });
    }

    refreshCanvas(){
        const currentContent = {
            html: editor.getHtml(),
            css: editor.getCss(),
        };

        const monacoWrapper = document.querySelector('.monaco-draggable-wrapper');
        if (monacoWrapper) {
            monacoWrapper.remove();
        }


        setTimeout(() => {
            initEditor(currentContent);
        }, 100);
    }
}

export { refreshCanvasManager }