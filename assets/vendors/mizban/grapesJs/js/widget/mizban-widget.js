export function fetchCSSClasses(url) {
    return fetch(url)
        .then(response => response.text())
        .then(cssText => {
            const classNames = new Set();
            const regex = /\.([a-zA-Z0-9_-]+)/g;
            let match;
            while ((match = regex.exec(cssText)) !== null) {
                classNames.add(match[1]);
            }
            return Array.from(classNames);
        })
        .catch(error => {
            console.error('Error fetching CSS classes:', error);
            return [];
        });
}

export function createDataListForInput(input, cssClasses) {
    if (!input) return;
    const dataList = document.createElement('datalist');
    dataList.id = 'cssClassList';
    input.setAttribute('list', dataList.id);

    cssClasses.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        dataList.appendChild(option);
    });

    input.parentNode.insertBefore(dataList, input.nextSibling);
}

export function saveImageToFolder(file) {
    return window.showDirectoryPicker()
        .then(dirHandle => dirHandle.getFileHandle(file.name, { create: true }))
        .then(newFileHandle => newFileHandle.createWritable())
        .then(writable => {
            return writable.write(file).then(() => writable.close());
        })
        .catch(error => console.error('Error saving image:', error));
}

export function copyCSSLinksToIframe(editor) {
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    cssLinks.forEach(link => {
        const newLinkEl = document.createElement('link');
        newLinkEl.rel = 'stylesheet';
        newLinkEl.href = link.href;

        editor.on('load', () => {
            const iframe = editor.Canvas.getFrameEl();
            iframe.contentDocument.head.appendChild(newLinkEl);
        });
    });
}

export function setupComponentIdListener(editor) {
    editor.on('component:add', (component) => {
        const currentId = component.getId();
        if (currentId && !currentId.startsWith('mizban-')) {
            component.setId(`mizban-${currentId}`);
        }
    });
}

export function setupCommand(editor, name, callback) {
    editor.Commands.add(name, {
        run(editor, sender) {
            sender && sender.set('active', 0);
            callback();
        }
    });
}
