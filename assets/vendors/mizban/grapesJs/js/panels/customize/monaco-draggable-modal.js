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
        <i id="cleanCode" class="fa-solid fa-align-left on-primary-color cursor-pointer p-1" title="Clean Code"></i>
        <i id="htmlCode" class="fa-brands fa-html5 on-primary-color cursor-pointer p-1" title="Html"></i>
        <i id="cssCode" class="fa-brands fa-css3 on-primary-color cursor-pointer p-1" title="Css"></i>
      </div>
      <div class="monaco-close-btn">
      <i id="monacoMinusBtn" class="fa-solid fa-minus on-primary-color txt-subtitle" title="minus"></i>
      <i id="monacoScreenBtn" class="fa-solid fa-expand on-primary-color txt-subtitle" title="full screen"></i>
      <i id="monacoCloseBtn" class="fa-solid fa-close on-primary-color txt-subtitle" title="close"></i>
    `;

    const content = document.createElement('div');
    content.className = 'monaco-content';

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    document.body.appendChild(wrapper);

    setupDragging(header, wrapper);
    setupMonacoWindowControls(wrapper);

    return { wrapper, content };
  }

  const { wrapper, content } = createDraggableWrapper();

  window.monacoDraggableWrapper = wrapper;
  window.monacoDraggableContent = content;
}

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

function setupMonacoWindowControls(wrapper) {
  const content = wrapper.querySelector('.monaco-content');
  const minusBtn = document.getElementById('monacoMinusBtn');
  const screenBtn = document.getElementById('monacoScreenBtn');
  const closeBtn = document.getElementById('monacoCloseBtn');

  let isMinimized = false;
  let isFullScreen = false;
  let prevStyles = {};
  let prevContentStyles = {};

  const savePrevStyles = () => {
    prevStyles = {
      width: wrapper.style.width,
      height: wrapper.style.height,
      top: wrapper.style.top,
      left: wrapper.style.left,
      position: wrapper.style.position,
    };
    prevContentStyles = {
      width: content.offsetWidth + 'px',
      height: content.offsetHeight + 'px',
      maxWidth: content.style.maxWidth,
      maxHeight: content.style.maxHeight,
    };
  };

  const restorePrevStyles = () => {
    wrapper.style.width = prevStyles.width || '';
    wrapper.style.height = prevStyles.height || '';
    wrapper.style.top = prevStyles.top || '';
    wrapper.style.left = prevStyles.left || '';
    wrapper.style.position = prevStyles.position || '';

    content.style.width = prevContentStyles.width || '';
    content.style.height = prevContentStyles.height || '';
    content.style.maxWidth = prevContentStyles.maxWidth || '';
    content.style.maxHeight = prevContentStyles.maxHeight || '';
  };

  closeBtn?.addEventListener('click', () => {
    wrapper.remove();
  });

  minusBtn?.addEventListener('click', () => {
    const style = document.createElement('style');
    style.textContent = `
    .minimized {
      height: 62px !important;
    }
    `;
    document.head.appendChild(style);
    wrapper.classList.toggle('minimized');
    content.classList.toggle('d-none');
  });

  screenBtn?.addEventListener('click', () => {
    if (!isFullScreen) {
      savePrevStyles();
      wrapper.style.position = 'fixed';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.maxWidth = '100vw';
      wrapper.style.maxHeight = '100vh';
      wrapper.style.width = '100vw';
      wrapper.style.height = '100vh';
      wrapper.style.maxWidth = '100vw';

      content.style.maxWidth = '100vw';
      content.style.maxHeight = '100vh';
      content.style.width = '100vw';
      content.style.height = '100vh';
      isFullScreen = true;
    } else {
      restorePrevStyles();
      isFullScreen = false;
    }
  });
}

window.monacoState = { minimized: false };