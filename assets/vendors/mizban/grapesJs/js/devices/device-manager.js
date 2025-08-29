import { breakPoints } from "../../../commands/variables.js";

function device_Manager(editor) {
    Object.keys(breakPoints).forEach(key => {
        const originalValue = breakPoints[key];
        const numericValue = parseInt(originalValue, 10);

        const canvasWidth = (numericValue - 1) + 'px';
        
        try {
            editor.Devices.add({
                id: key,
                name: key,
                width: canvasWidth,
                widthMedia: originalValue,
            });
        } catch (error) {}
    });

    let filename = window.location.pathname.split('/').pop();
    if (!filename) filename = 'index.html';
    const pageId = filename.replace(/\./g, '_');
    const storageKey = `gjs_${pageId}`;

    const lastDevice = localStorage.getItem(`${storageKey}_device`) || 'Desktop';

    editor.on('change:device', () => {
        const currentDevice = editor.getDevice();
        localStorage.setItem(`${storageKey}_device`, currentDevice);
    });

    editor.on('load', () => {
        editor.setDevice(lastDevice);
    });
}

export { device_Manager }