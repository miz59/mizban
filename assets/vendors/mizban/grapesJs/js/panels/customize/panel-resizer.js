function buildResizer(){
    const resizer = document.createElement('div');
    resizer.id = 'resizer';
    return resizer
}

function setupResizer(container, monacoContainer, cssMonacoContainer, resizer, side){
    console.log('first')
    let isResizing = false;
    let handleMouseMove, handleMouseUp;
  
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  
    const resizerCursor = side ? 'row-resize' : 'col-resize';
    console.log(resizer)
    if (side) {
      handleMouseMove = e => {
        if (!isResizing) return;
        const containerRect = container.getBoundingClientRect();
        const newTopHeightPx = e.clientY - containerRect.top;
        const newTopHeightPercent = (newTopHeightPx / containerRect.height) * 100;
        const newBottomHeightPercent = 100 - newTopHeightPercent;
        if (newTopHeightPercent < 10 || newBottomHeightPercent < 10) return;
        monacoContainer.style.height = `${newTopHeightPercent}%`;
        cssMonacoContainer.style.height = `${newBottomHeightPercent}%`;
        resizer.style.top = `${newTopHeightPercent}%`;
      };
      handleMouseUp = () => {
        if (isResizing) {
          isResizing = false;
          document.body.style.cursor = '';
        }
      };
    } else {
      handleMouseMove = e => {
        if (!isResizing) return;
        const containerRect = container.getBoundingClientRect();
        const newLeftWidthPx = e.clientX - containerRect.left;
        const newLeftWidthPercent = (newLeftWidthPx / containerRect.width) * 100;
        const newRightWidthPercent = 100 - newLeftWidthPercent;
        if (newLeftWidthPercent < 10 || newRightWidthPercent < 10) return;
        monacoContainer.style.width = `${newLeftWidthPercent}%`;
        cssMonacoContainer.style.width = `${newRightWidthPercent}%`;
        resizer.style.right = `${newRightWidthPercent}%`;
      };
      handleMouseUp = () => {
        if (isResizing) {
          isResizing = false;
          document.body.style.cursor = '';
        }
      };
    }
  
    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      document.body.style.cursor = resizerCursor;
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

export default setupResizer;