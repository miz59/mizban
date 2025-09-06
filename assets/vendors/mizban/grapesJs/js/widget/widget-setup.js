import {
    createDataListForInput,
    saveImageToFolder,
    copyCSSLinksToIframe,
    setupCommand,
    initializeCSSAutocomplete
} from './mizban-widget.js';

export function initializeWidgets(editor) {
    copyCSSLinksToIframe(editor);

    setupCommand(editor, 'send-email', () => alert('Email sent!'));
    setupCommand(editor, 'save-template', () => alert('Template saved!'));

    initializeCSSAutocomplete(editor);
}
