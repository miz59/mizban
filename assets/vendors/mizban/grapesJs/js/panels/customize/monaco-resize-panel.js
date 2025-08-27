

export function makeWrapperResizable(wrapper) {
    const minusBtn = document.getElementById('monacoMinusBtn');

    if (!wrapper) return;

    const cs = getComputedStyle(wrapper);
    wrapper.style.transform = 'none';

    const initRect = wrapper.getBoundingClientRect();
    if (cs.left === 'auto') {
        wrapper.style.left = (initRect.left / window.innerWidth) * 100 + '%';
    }
    if (cs.top === 'auto') {
        wrapper.style.top = (initRect.top / window.innerHeight) * 100 + '%';
    }

    const minWidthPercent = 30;
    const minHeightPercent = 20;

    const positions = [
        'top-left cursor-nw', 'top-right cursor-ne', 'bottom-left cursor-ne', 'bottom-right cursor-nw',
        'top cursor-n', 'right cursor-e', 'bottom cursor-n', 'left cursor-e'
    ];
    positions.forEach(pos => {
        const h = document.createElement('div');
        h.className = `resize-handle ${pos}`;
        wrapper.appendChild(h);
    });

    // --- مقدار اولیه برای monaco-content
    const r = wrapper.getBoundingClientRect();
    const initW = (r.width / window.innerWidth) * 100;
    const initH = (r.height / window.innerHeight) * 100;
    const pxWidth = (initW / 100) * window.innerWidth;
    const pxHeight = (initH / 100) * window.innerHeight - 62;
    const content = wrapper.querySelector('.monaco-content');

    if (content) {
        content.style.width = pxWidth + 'px';
        content.style.height = pxHeight + 'px';
    }
    // ---

    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startW, startH, startL, startT;

    wrapper.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            currentHandle = e.target;
            startX = e.clientX;
            startY = e.clientY;

            const r = wrapper.getBoundingClientRect();
            startW = (r.width / window.innerWidth) * 100;
            startH = (r.height / window.innerHeight) * 100;
            startL = (r.left / window.innerWidth) * 100;
            startT = (r.top / window.innerHeight) * 100;

            // handle.style.width = '10vw';
            // handle.style.height = '10vw';

            wrapper.style.transform = 'none';
            document.body.style.userSelect = 'none';

            if (handle.classList.contains("cursor-n")) {
                document.body.style.cursor = 'n-resize';
                handle.style.width = 'calc(100% - 3vw)';
                handle.style.height = '10vw';
            }
            else if (handle.classList.contains("cursor-e")) {
                document.body.style.cursor = 'e-resize';
                handle.style.width = '10vw';
                handle.style.height = 'calc(100% - 3vw)';

            }
            else if (handle.classList.contains("cursor-ne")) {
                document.body.style.cursor = 'ne-resize';
                handle.style.width = '10vw';
                handle.style.height = '10vw';
            }
            else if (handle.classList.contains("cursor-nw")) {
                document.body.style.cursor = 'nw-resize';
                handle.style.width = '10vw';
                handle.style.height = '10vw';
            }
            e.preventDefault();
            e.stopPropagation();
        });
    });

    const onMouseMove = (e) => {
        if (!isResizing || !currentHandle) return;

        const cls = currentHandle.classList;
        const dX = ((e.clientX - startX) / window.innerWidth) * 100;
        const dY = ((e.clientY - startY) / window.innerHeight) * 100;

        let newW = startW;
        let newH = startH;
        let newL = startL;
        let newT = startT;

        if (cls.contains('right') || cls.contains('top-right') || cls.contains('bottom-right')) {
            newW = startW + dX;
        }
        if (cls.contains('left') || cls.contains('top-left') || cls.contains('bottom-left')) {
            newW = startW - dX;
            newL = startL + dX;
        }
        if (cls.contains('bottom') || cls.contains('bottom-left') || cls.contains('bottom-right')) {
            newH = startH + dY;
        }
        if (cls.contains('top') || cls.contains('top-left') || cls.contains('top-right')) {
            newH = startH - dY;
            newT = startT + dY;
        }

        if (newW < minWidthPercent) {
            if (cls.contains('left') || cls.contains('top-left') || cls.contains('bottom-left')) {
                newL = startL + (startW - minWidthPercent);
            }
            newW = minWidthPercent;
        }
        if (newH < minHeightPercent) {
            if (cls.contains('top') || cls.contains('top-left') || cls.contains('top-right')) {
                newT = startT + (startH - minHeightPercent);
            }
            newH = minHeightPercent;
        }

        const maxL = 100 - newW;
        const maxT = 100 - newH;
        newL = Math.max(0, Math.min(newL, maxL));
        newT = Math.max(0, Math.min(newT, maxT));

        wrapper.style.width = newW + '%';
        wrapper.style.height = newH + '%';
        wrapper.style.left = newL + '%';
        wrapper.style.top = newT + '%';

        const pxWidthMove = (newW / 100) * window.innerWidth;
        const pxHeightMove = (newH / 100) * window.innerHeight - 62;
        if (content) {
            content.style.width = pxWidthMove + 'px';
            content.style.height = pxHeightMove + 'px';
        }
    };



    const onMouseUp = () => {
        if (!isResizing) return;
        isResizing = false;
        currentHandle = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        wrapper.querySelectorAll('.resize-handle').forEach(handle => {
            handle.style.width = '';
            handle.style.height = '';
        });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}