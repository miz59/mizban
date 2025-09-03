function editor_events(editor) {
    editor.on('load', () => {
        const body = editor.getWrapper();
        body.set('traits', [
            {
                type: 'text',
                label: 'title',
                name: 'title',
            },
            {
                type: 'color',
                label: 'background color',
                name: 'background-color',
            },
            {
                type: 'text',
                label: 'width',
                name: 'width',
            },
            {
                type: 'text',
                label: 'height',
                name: 'height',
            }
        ]);
        body.on('change:title', (model, value) => {
            document.title = value;
        });

        body.on('change:background-color', (model, value) => {
            body.setStyle({ 'background-color': value });
        });

        body.on('change:font-family', (model, value) => {
            body.setStyle({ 'font-family': value });
        });



    })


    // editor.on('block:drag:stop', function (model) {
    //     if (model.attributes.tagName === "img") {
    //         editor.runCommand('open-assets');
    //     }
    //     model.addStyle({
    //         // padding: '10px',
    //     });
    // });
}

export { editor_events }