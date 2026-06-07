export function setupResizeHandling(editorContainer, htmlContainer, cssContainer, resizeHandle) {
	let isResizing = false;
	let startX, startLeftPercent;

	function startResizing(e) {
		isResizing = true;
        if (e.type.includes("touch")){
            startX = e.touches[0].clientX;
        }
        else{
            startX = e.clientX;
        }
		startLeftPercent = parseFloat(htmlContainer.style.width) || 50;

		editorContainer.style.width = editorContainer.offsetWidth + "px";
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";

		e.preventDefault();
		e.stopPropagation();
	}

	function stopResizing() {
		if (!isResizing) return;

		isResizing = false;
		document.body.style.cursor = "default";
		document.body.style.userSelect = "";
		editorContainer.style.width = "";

		if (window.monacoEditor) window.monacoEditor.layout();
		if (window.cssMonacoContainer) window.cssMonacoContainer.layout();
	}

	function resize(e) {
		if (!isResizing) return;

		let deltaX;
        if (e.type.includes("touch")){
            deltaX = e.touches[0].clientX - startX;
        }
        else {
            deltaX = e.clientX - startX;
        }
		const containerWidth = editorContainer.offsetWidth;
		const deltaPercent = (deltaX / containerWidth) * 100;

		let newLeftPercent = startLeftPercent + deltaPercent;
		newLeftPercent = Math.max(20, Math.min(80, newLeftPercent));
		const rightPercent = 100 - newLeftPercent;

		requestAnimationFrame(() => {
			htmlContainer.style.width = newLeftPercent + "%";
			cssContainer.style.width = rightPercent + "%";
			resizeHandle.style.left = newLeftPercent + "%";
		});

		if (window.monacoEditor) window.monacoEditor.layout();
		if (window.cssMonacoContainer) window.cssMonacoContainer.layout();

		e.preventDefault();
		e.stopPropagation();
	}

	resizeHandle.addEventListener("mousedown", startResizing);
	resizeHandle.addEventListener("touchstart", startResizing);
	document.addEventListener("mousemove", resize);
	document.addEventListener("touchmove", resize);
	document.addEventListener("mouseup", stopResizing);
	document.addEventListener("touchend", stopResizing);
}
