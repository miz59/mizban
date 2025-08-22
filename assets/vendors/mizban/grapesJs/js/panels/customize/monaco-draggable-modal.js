// ===== DRAGGABLE MODAL SETUP =====
export function setupDraggableModal(modal) { 
  function createDraggableWrapper() {
    const existingWrapper = document.querySelector('.monaco-draggable-wrapper');
    if (existingWrapper) {
      if (window.monacoEditor) {
        window.monacoEditor.dispose();
        window.monacoEditor = null;
      }
      if (window.cssMonacoContainer) {
        window.cssMonacoContainer.dispose();
        window.cssMonacoContainer = null;
      }
      existingWrapper.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'monaco-draggable-wrapper';
    
    const header = document.createElement('div');
    header.className = 'monaco-header';
    header.innerHTML = `
      <div class="d-flex align-items-center gap-1">
        <span class="on-primary-color font-weight-bold font-primary">Code Editor</span>
        <i id="cleanCode" class="fa-solid fa-align-left on-primary-color cursor-pointer p-1 radius-all-small" title="Clean Code"></i>
      </div>
      <div class="monaco-close-btn">
        <i id="monacoCloseBtn" class="fa-solid fa-close on-primary-color txt-subtitle"></i>
    `;
    
    const content = document.createElement('div');
    content.className = 'monaco-content';
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    
    document.body.appendChild(wrapper);
    
    setupDragging(header, wrapper);
    setupCloseButton(wrapper);
    
    return { wrapper, content };
  }

  const { wrapper, content } = createDraggableWrapper();
  
  window.monacoDraggableWrapper = wrapper;
  window.monacoDraggableContent = content;
}

// ===== DRAGGING FUNCTIONALITY =====
function setupDragging(header, wrapper) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  function startDragging(e) {
    if (e.target.closest('#cleanCode') || e.target.closest('#monacoCloseBtn')) {
      return;
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = wrapper.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    
    wrapper.classList.add('dragging');
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
  }

  function stopDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    wrapper.classList.remove('dragging');
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  }

  function drag(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newLeft = startLeft + deltaX;
    const newTop = startTop + deltaY;
    
    const maxX = window.innerWidth - wrapper.offsetWidth;
    const maxY = window.innerHeight - wrapper.offsetHeight;
    
    const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
    const boundedTop = Math.max(0, Math.min(newTop, maxY));
    
    wrapper.style.left = boundedLeft + 'px';
    wrapper.style.top = boundedTop + 'px';
    wrapper.style.transform = 'none';
    
    e.preventDefault();
  }

  header.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  header.addEventListener('selectstart', (e) => e.preventDefault());
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDragging) {
      stopDragging();
    }
  });
}

// ===== CLOSE BUTTON SETUP =====
function setupCloseButton(wrapper) {
  document.getElementById('monacoCloseBtn').addEventListener('click', () => {
    wrapper.remove();
  });
}
