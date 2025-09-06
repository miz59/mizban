// class saveProject {
//     constructor(editor) {
//         this.editor = editor;
//     }

//     // add popup for ask do you want save on your code ?
//     // add multy images in assets ?
//     showSaveConfirmation() {
//         const confirmation = confirm("Do you want to save your changes?");
//         if (confirmation) {
//             this.setupImportCommand();
//         }
//     }

//     setupImportCommand() {
//         if (!this.editor || !this.editor.Commands) {
//             console.error('Editor is not ready or Commands is undefined');
//             return;
//         }

//         this.editor.Commands.add('save-project', {
//             run: (editor, sender) => {
//                 sender && sender.set('active', 0);

//                 const html = editor.getHtml();
//                 const css = editor.getCss();
//                 const bodyContent = `<style>${css}</style>${html}`;

//                 const formData = new FormData();
//                 formData.append("filename", 'current-page.html');
//                 formData.append("html", bodyContent);

//                 fetch('/save', {
//                     method: 'POST',
//                     body: formData
//                 })
//                     .then(res => res.json())
//                     .then(() => this.saveProjectSuccessfully())
//                     .catch(err => alert('Error saving file: ' + err.message));
//             }
//         });
//     }

//     saveProjectSuccessfully() {
//         alert('Project saved successfully hossein!');
//     }
// }

// export { saveProject };