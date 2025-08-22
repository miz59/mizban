import { createCSSClassDropdown } from '../panels/style-manager.js';
import { 
  getCSSClassesFromFiles, 
  addCSSFile, 
  removeCSSFile, 
  getCSSFiles 
} from '../panels/functions/css-classes.js';

export function createDataListForInput(input, cssClasses) {
    if (!input) return;
    createCSSClassDropdown(input, cssClasses);
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

export function initializeCSSAutocomplete(editor) {
    getCSSClassesFromFiles()
        .then(cssClasses => {
            if (cssClasses.length > 0) {
                setupClassManagerAutocomplete(editor, cssClasses);
            }
        })
        .catch(error => {
            // Silent fail - no CSS classes available
        });
}

// تابع جدید برای تنظیم autocomplete در Class Manager
function setupClassManagerAutocomplete(editor, cssClasses) {
    // اضافه کردن event listener برای Class Manager
    editor.on('component:selected', function(component) {
        setTimeout(() => {
            const classInput = document.querySelector('#gjs-clm-new');
            if (classInput) {
                createDataListForInput(classInput, cssClasses);
            }
        }, 100);
    });
    
    // اضافه کردن event listener برای Class Manager panel
    editor.on('panel:open', function(panel) {
        if (panel.id === 'gjs-clm') {
            setTimeout(() => {
                const classInput = document.querySelector('#gjs-clm-new');
                if (classInput) {
                    createDataListForInput(classInput, cssClasses);
                }
            }, 200);
        }
    });
}

// تابع برای دریافت CSS classes به صورت select options
export function getCSSClassesAsOptions() {
    return new Promise((resolve) => {
        getCSSClassesFromFiles()
            .then(cssClasses => {
                const options = cssClasses.map(className => ({
                    id: className,
                    label: className.charAt(0).toUpperCase() + className.slice(1).replace(/-/g, ' ')
                }));
                resolve(options);
            })
            .catch(() => {
                // اگر فایل‌های CSS در دسترس نباشند، array خالی برگردان
                resolve([]);
            });
    });
}

// Re-export توابع از css-classes.js
export { addCSSFile, removeCSSFile, getCSSFiles };
