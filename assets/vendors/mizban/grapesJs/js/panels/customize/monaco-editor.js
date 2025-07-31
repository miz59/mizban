import { createEditorContainer, resetEditorsResize } from './monaco-editor-container.js';
import { setupResizeHandling } from './monaco-resize-handler.js';
import { setupDraggableModal } from './monaco-draggable-modal.js';
import { initializeMonacoEditors } from './monaco-editors-manager.js';

// ===== MONACO EDITOR SETUP =====
function setupCodeEditorCommand(editor, modal, container, monacoContainer, resizer, cssMonacoContainer) {
  editor.Commands.add('code-editor', {
    run: (mainEditor, sender) => {
      let cssCode = mainEditor.getCss();
      mainEditor.setStyle(cssCode);
      
      setupDraggableModal(modal);
      
      const wrapperContent = window.monacoDraggableContent;
      const editorContainer = createEditorContainer();
      
      // Setup resize handling
      const htmlContainer = editorContainer.querySelector('#htmlEditor');
      const cssContainer = editorContainer.querySelector('#cssEditor');
      const resizeHandle = editorContainer.querySelector('.monaco-resize-handle');
      
      setupResizeHandling(editorContainer, htmlContainer, cssContainer, resizeHandle);
      
      wrapperContent.appendChild(editorContainer);
      setEditorHeader(mainEditor);
      resetEditorsResize(htmlContainer, cssContainer);
      
      initializeMonacoEditors(mainEditor, editorContainer);
    },
  });
}

// ===== UTILITY FUNCTIONS =====
function setEditorHeader(mainEditor) {
  // Placeholder for future header setup
}

// ===== EXPORTS =====
export { setupCodeEditorCommand }; 