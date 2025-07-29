import {
    fetchCSSClasses,
    createDataListForInput,
    saveImageToFolder,
    copyCSSLinksToIframe,
    setupComponentIdListener,
    setupCommand
} from './mizban-widget.js';

export function initializeWidgets(editor) {
    setupComponentIdListener(editor);
    copyCSSLinksToIframe(editor);

    setupCommand(editor, 'send-email', () => alert('Email sent!'));
    setupCommand(editor, 'save-template', () => alert('Template saved!'));

    fetchCSSClasses('./assets/css/miz.min.css').then(cssClasses => {
        const input = document.querySelector('#gjs-clm-new');
        createDataListForInput(input, cssClasses);
    });
}
