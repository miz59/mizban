import {
    fetchCSSClasses,
    createDataListForInput,
    saveImageToFolder,
    copyCSSLinksToIframe,
    setupComponentIdListener,
    setupCommand,
    initializeCSSAutocomplete
} from './mizban-widget.js';

export function initializeWidgets(editor) {
    setupComponentIdListener(editor);
    copyCSSLinksToIframe(editor);

    setupCommand(editor, 'send-email', () => alert('Email sent!'));
    setupCommand(editor, 'save-template', () => alert('Template saved!'));

    // Initialize CSS autocomplete with better error handling
    initializeCSSAutocomplete(editor);
}
