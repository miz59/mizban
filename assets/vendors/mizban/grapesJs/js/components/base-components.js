function base_component(editor) {
    editor.DomComponents.addType("link", {
        model: {
            defaults: {
                traits: [
                    "title",
                    "href",
                    {
                        name: "target",
                        type: "select",
                        options: [
                            {
                                id: "this_windows", labels: "this window",
                            },
                            {
                                id: "new_windows", label: "new window"
                            }
                        ]
                    }
                ]
            },
        },
    });


    editor.DomComponents.addType('image', {
        model: {
            defaults: {
                traits: [
                    'alt',
                ]
            }
        }
    });

    editor.DomComponents.addType("input", {
        model: {
            defaults: {
                traits: [
                    "Name", "placeholder",
                    {
                        name: "type",
                        type: "select",
                        options: [
                            {id: "text", label: "text"},
                            {id: "email", label: "email"},
                            {id: "password", label: "password"},
                            {id: "number", label: "number"},
                        ]
                    },
                    {
                        name: "required",
                        type: "checkbox",
                    }
                ]
            }
        }
    });

    editor.DomComponents.addType("textAria", {
        model: {
            defaults: {
                traits: [
                    "Name", "placeholder",

                    {
                        name: "required",
                        type: "checkbox",
                    }
                ]
            }
        }
    })

    editor.DomComponents.addType("label", {
        model: {
            defaults: {
                traits: [
                    "For"
                ],
            }
        }
    });

    editor.DomComponents.addType("buttons", {
        model: {
            defaults: {
                traits: [
                    "For"
                ],
            }
        }
    });

    editor.DomComponents.addType("checkBox", {
        model: {
            defaults: {
                traits: [
                    "name", "value",
                    {
                        name:"required",
                        label: "required",
                        type: "checkbox"
                    },
                    {
                        name:"Checked",
                        label: "Checked",
                        type: "checkbox"
                    }

                ]
            }
        }
    });

    editor.DomComponents.addType("radio", {
        model: {
            defaults: {
                traits: [
                    "name", "value",
                    {
                        name:"required",
                        label: "required",
                        type: "checkbox"
                    },
                    {
                        name:"Checked",
                        label: "Checked",
                        type: "checkbox"
                    }

                ]
            }
        }
    });
}



export {base_component}