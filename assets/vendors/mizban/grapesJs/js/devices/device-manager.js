import { breakPoints } from "../../../commands/variables.js";

function device_Manager(editor) {
    Object.keys(breakPoints).forEach(key => {
        const originalValue = breakPoints[key];
        const numericValue = parseInt(originalValue, 10);
        const adjustedValue = (numericValue - 1) + 'px';
        
        try {
            editor.Devices.add({
                id: key,
                name: key,
                width: adjustedValue,
            })
        } catch (error) {}
    });
    editor.Devices.add([{
        name: 'desktop',
        width: '',
    }
    ]);
}

export {device_Manager}