export function fetchCSSClasses(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
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
            console.warn(`CSS file not found or not accessible: ${url}`);
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

export function getCSSClassesFromDocument() {
    const classNames = new Set();
    
    // Get all stylesheets from the document
    const styleSheets = Array.from(document.styleSheets);
    
    styleSheets.forEach(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            rules.forEach(rule => {
                if (rule.selectorText) {
                    // Extract class names from selectors
                    const classMatches = rule.selectorText.match(/\.([a-zA-Z0-9_-]+)/g);
                    if (classMatches) {
                        classMatches.forEach(match => {
                            classNames.add(match.substring(1)); // Remove the dot
                        });
                    }
                }
            });
        } catch (error) {
            // CORS error or other issues, skip this stylesheet
            console.warn('Could not access stylesheet:', error);
        }
    });
    
    return Array.from(classNames);
}

export function initializeCSSAutocomplete(editor) {
    // Try to get CSS classes from existing stylesheets first
    const existingClasses = getCSSClassesFromDocument();
    
    if (existingClasses.length > 0) {
        const input = document.querySelector('#gjs-clm-new');
        if (input) {
            createDataListForInput(input, existingClasses);
            console.log(`Found ${existingClasses.length} CSS classes from existing stylesheets`);
        }
    } else {
        // Fallback to fetching from file
        fetchCSSClasses('./assets/css/miz.min.css')
            .then(cssClasses => {
                const input = document.querySelector('#gjs-clm-new');
                if (input && cssClasses.length > 0) {
                    createDataListForInput(input, cssClasses);
                    console.log(`Found ${cssClasses.length} CSS classes from file`);
                }
            })
            .catch(error => {
                console.warn('No CSS classes available for autocomplete');
            });
    }
}
