class cleanConfirmation {
    constructor(editor) {
        this.editor = editor;
    }

    setupImportCommand(){
        this.editor.Commands.add('clean-canvas', {
            // run: () => {
            //     // sender && sender.set('active', 0);
            //     this.show();
            // }
            run: () => this.show()
        });
    }

    getCleanConfirmationContent() {
        return `
            <div class="modal-question cursor-pointer">
                <p>Are you sure you want to delete the output you are currently viewing?</p>
                <p style="color: #ff6b6b; font-size: 14px; margin-top: 10px;">This operation cannot be reversed!</p>
            </div>
        `;
    }

    show() {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'gjs-mdl-container gjs-mdl-dialog gjs-one-bg gjs-two-color delete-confirmation-modal position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center';
        modalContainer.style.cssText = 'background: rgba(0,0,0,0.5); z-index: 1000; max-width:100%;';

        const modalDialog = document.createElement('div');
        modalDialog.className = 'gjs-mdl-content bg-disabled-dark-color on-primary-color p-2 radius-all-small';

        const title = document.createElement('h3');
        title.textContent = 'Delete output';
        title.style.cssText = 'margin: 0 0 15px 0; color: #fff;';

        const content = document.createElement('div');
        content.innerHTML = this.getCleanConfirmationContent();

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center gap-2 mt-2';

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.className = 'on-primary-color border-style-none radius-all-small px-2 py-1 cursor-pointer bg-success-regular-color';
        noButton.id = 'noDeleteCode';
        noButton.onclick = () => {
            document.body.removeChild(modalContainer);
        };

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.className = 'on-primary-color border-style-none radius-all-small px-2 py-1 cursor-pointer bg-danger-regular-color';
        yesButton.id = 'yesDeleteCode';
        yesButton.onclick = () => {
            this.editor.runCommand('core:canvas-clear');

            setTimeout(() => {
                if (window.monacoEditor) {
                    window.monacoEditor.setValue('<div>Hello World</div>');
                    console.log('✅ Monaco HTML editor cleared');
                }
                if (window.cssMonacoContainer) {
                    window.cssMonacoContainer.setValue('');
                    console.log('✅ Monaco CSS editor cleared');
                }

                if (window.mainEditor) {
                    window.mainEditor.setComponents('<div>Hello World</div>');
                    window.mainEditor.setStyle('');
                    window.mainEditor.store();
                    console.log('✅ GrapesJS updated with cleared content');
                }
            }, 100);

            document.body.removeChild(modalContainer);
        };

        buttonContainer.appendChild(noButton);
        buttonContainer.appendChild(yesButton);

        modalDialog.appendChild(title);
        modalDialog.appendChild(content);
        modalDialog.appendChild(buttonContainer);
        modalContainer.appendChild(modalDialog);

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });

        document.body.appendChild(modalContainer);
    }
}

export { cleanConfirmation }