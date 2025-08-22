// ===== EDITOR CONTAINER CREATION =====
export function createEditorContainer() {
  const editorContainer = document.createElement('div');
  editorContainer.className = 'monaco-editor-container';
  
  const htmlContainer = document.createElement('div');
  htmlContainer.id = 'htmlEditor';
  htmlContainer.className = 'html-editor';
  
  const cssContainer = document.createElement('div');
  cssContainer.id = 'cssEditor';
  cssContainer.className = 'css-editor';
  
  const htmlImportCodeContainer = document.createElement('div');
  htmlImportCodeContainer.id = 'htmlImportCodeContainer';
  htmlImportCodeContainer.className = 'html-import-code-editor';

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'monaco-resize-handle';
  
  editorContainer.appendChild(htmlContainer);
  editorContainer.appendChild(cssContainer);
  editorContainer.appendChild(resizeHandle);
  editorContainer.appendChild(htmlImportCodeContainer);

  return editorContainer;
}

export function resetEditorsResize(htmlContainer, cssContainer, htmlImportCodeContainer) {
  htmlContainer.style.width = '50%';
  // cssContainer.style.width = '50%';
  htmlImportCodeContainer.style.width = '50%';
} 