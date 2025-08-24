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
    wrapper.style.left = '25%';
    wrapper.style.top = '25%';

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
  let startX, startY, startLeftPercent, startTopPercent;

  function startDragging(e) {
    if (e.target.closest('#cleanCode') || e.target.closest('#monacoCloseBtn')) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = wrapper.getBoundingClientRect();
    startLeftPercent = (rect.left / window.innerWidth) * 100;
    startTopPercent = (rect.top / window.innerHeight) * 100;

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

    const deltaX = ((e.clientX - startX) / window.innerWidth) * 100;
    const deltaY = ((e.clientY - startY) / window.innerHeight) * 100;

    let newLeft = startLeftPercent + deltaX;
    let newTop = startTopPercent + deltaY;

    // محدود کردن به داخل صفحه
    const maxLeft = 100 - (wrapper.offsetWidth / window.innerWidth) * 100;
    const maxTop = 100 - (wrapper.offsetHeight / window.innerHeight) * 100;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    wrapper.style.left = newLeft + '%';
    wrapper.style.top = newTop + '%';
    wrapper.style.transform = 'none';

    e.preventDefault();
  }

  header.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  header.addEventListener('selectstart', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDragging) stopDragging();
  });
}

// ===== CLOSE BUTTON SETUP =====
function setupCloseButton(wrapper) {
  document.getElementById('monacoCloseBtn').addEventListener('click', () => {
    wrapper.remove();
  });
}