import { breakPoints } from "../../../commands/variables.js";
function commands(editor) {
    editor.Commands.add('set-device-desktop', {
        run: editor => editor.setDevice('desktop')
    });
    editor.Commands.add('set-device-mobile', {
        run: editor => editor.setDevice('mobile')
    });
    editor.Commands.add('set-device-tablet', {
        run: editor => editor.setDevice('tablet')
    });
    editor.Commands.add('set-device-A4', {
        run: editor => editor.setDevice('A4')
    });
    editor.Commands.add('set-device-A5', {
        run: editor => editor.setDevice('A5')
    });

    Object.keys(breakPoints).forEach(key => {
        editor.Commands.add(`set-device-${key}`, {
            run: editor => editor.setDevice(key)
        });
    });
}



export  {commands}