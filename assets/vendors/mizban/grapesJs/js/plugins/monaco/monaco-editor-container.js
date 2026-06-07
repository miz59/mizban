export function createEditorContainer() {
	const editorContainer = document.createElement("div");
	editorContainer.className = "monaco-editor-container";

	const htmlContainer = document.createElement("div");
	htmlContainer.id = "htmlEditor";
	htmlContainer.className = "html-editor";

	const cssContainer = document.createElement("div");
	cssContainer.id = "cssEditor";
	cssContainer.className = "css-editor";

	const resizeHandle = document.createElement("div");
	resizeHandle.className = "monaco-resize-handle";

	editorContainer.appendChild(htmlContainer);
	editorContainer.appendChild(cssContainer);
	editorContainer.appendChild(resizeHandle);

	return editorContainer;
}

export function resetEditorsResize(htmlContainer, cssContainer) {
	htmlContainer.style.width = "50%";
	cssContainer.style.width = "50%";
}
