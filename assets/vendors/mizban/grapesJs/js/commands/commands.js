import { breakPoints } from "../../../commands/variables.js";

function commands(editor) {
    Object.keys(breakPoints).forEach(key => {
        editor.Commands.add(`set-device-${key}`, {
            run: editor => editor.setDevice(key)
        });
    });
}


export  {commands}