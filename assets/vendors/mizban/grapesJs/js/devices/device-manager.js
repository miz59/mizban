import { breakPoints } from "../../../commands/variables.js";

function device_Manager(editor) {
    let firstDevice = "";
    const deviceManager = editor.Devices;


    const deviceTest = editor.DeviceManager;
    deviceTest.getAll().reset();


    deviceManager.devices.models = [];

    const iframe = editor.Canvas.getFrameEl();
    const canvasWidth = iframe.contentWindow.document.documentElement.scrollWidth;

    Object.keys(breakPoints).forEach((key, index) => {

        index == 0 ? firstDevice = key : null;

        const breakpointOriginalValue = breakPoints[key];
        const breakpointNumericValue = parseInt(breakpointOriginalValue, 10);

        let newWidth;
        canvasWidth < breakpointNumericValue ? newWidth = canvasWidth : newWidth = breakpointNumericValue;

        try {
            deviceManager.add({
                id: key,
                name: key,
                width: index == 0 ? "" : `${newWidth - 1}px`,
                widthMedia: breakpointNumericValue,
            });


            editor.Commands.add(`set-device-${key}`, {
                run: function (editor, sender) {
                    const breakpointOriginalValue = breakPoints[key];
                    const breakpointNumericValue = parseInt(breakpointOriginalValue, 10);


                    if (canvasWidth < breakpointNumericValue) {
                        let scale = canvasWidth / breakpointNumericValue * 100;
                        editor.Canvas.setZoom(scale);
                    } else {
                        editor.Canvas.setZoom(100);
                    }

                    editor.setDevice(key);
                    setTimeout(() => {
                        const buttons = document.querySelectorAll('.gjs-pn-btn.btn-toggle-device');
                        const senderId = editor.getDevice();

                        buttons.forEach(button => {
                            const btnText = button.textContent.trim().toLowerCase();
                            const isSender = btnText === senderId.toLowerCase();

                            if (isSender) {
                                button.classList.remove('disabled');
                            } else {
                                button.classList.add('disabled');
                            }
                        });
                    }, 300);
                }
            });
        } catch (error) { }
    });

    let filename = window.location.pathname.split('/').pop();
    if (!filename) filename = 'index.html';
    const pageId = filename.replace(/\./g, '_');
    const storageKey = `gjs_${pageId}`;

    const localStorageDevice = localStorage.getItem(`${storageKey}_device`) || firstDevice;

    editor.on('change:device', () => {
        const currentDevice = editor.getDevice();
        localStorage.setItem(`${storageKey}_device`, currentDevice);
    });

    editor.runCommand(`set-device-${localStorageDevice}`);
}


export { device_Manager }