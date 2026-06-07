import { createEditorContainer, resetEditorsResize } from './monaco-editor-container.js';
import { setupResizeHandling } from './monaco-resize-handler.js';
import { setupDraggableModal } from './monaco-draggable-modal.js';
import { initializeMonacoEditors } from './monaco-editors-manager.js';
import { makeWrapperResizable  } from './monaco-resize-panel.js';

function setupCodeEditorCommand(editor , modal) {
    editor.Commands.add('code-editor', {
        run: (mainEditor, sender) => {
            let cssCode = mainEditor.getCss();
            mainEditor.setStyle(cssCode);
            
            setupDraggableModal(modal);
            const wrapperContent = window.monacoDraggableContent;

            const wrapper = window.monacoDraggableWrapper;

            const editorContainer = createEditorContainer();

            const htmlContainer = editorContainer.querySelector('#htmlEditor');
            const cssContainer = editorContainer.querySelector('#cssEditor');
            const resizeHandle = editorContainer.querySelector('.monaco-resize-handle');

            setupResizeHandling(editorContainer, htmlContainer, cssContainer, resizeHandle);

            wrapperContent.appendChild(editorContainer);
            resetEditorsResize(htmlContainer, cssContainer);

            initializeMonacoEditors(mainEditor, editorContainer);
            makeWrapperResizable(wrapper);
        },
    });
}

export { setupCodeEditorCommand }; 