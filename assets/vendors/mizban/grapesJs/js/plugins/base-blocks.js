import componentJson from "../../../commands/componentJson.js";

const category = {
    heading: {id: "heading_category", label: "Heading", open: false},
    basic: {id: "basic_category", label: "Basic", open: true},
    form: {id: "form_category", label: "Forms", open: false},
    components: {id: "components_category", label: "Components",open: true  },
    layouts: {id: "layouts_category", label: "Layouts",open: true},
}
function base_blocks(editor) {  
    editor.Blocks.add("section", {
        label: `<i class="fa-solid fa-square"></i><span>section</span>`,
        attributes: {class: "block"},
        category: category.layouts,
        content: {
            tagName: "section",
            attributes: {class: "section"},
        },
    });

    editor.Blocks.add("container", {
        label: `<i class="fa-solid fa-square"></i><span>container</span>`,
        attributes: {class: "block"},
        category: category.layouts,
        content: {
            tagName: "div",
            attributes: {class: "container"},
        },
    });
    editor.Blocks.add("div", {
        label: `<i class="fa-solid fa-square"></i><span>div</span>`,
        attributes: {class: "block"},
        category: category.layouts,
        content: {
            tagName: "div",
            attributes: {class: "div-element"},
        },
    });
    editor.Blocks.add("block", {
        label: `<i class="fa-solid fa-square"></i><span>block</span>`,
        attributes: {class: "block"},
        category: category.layouts,
        content: {
            tagName: "div",
            attributes: {class: "block-element"},
        },
    });

    editor.Blocks.add(`p_tag`, {
        activate: !0,
        label: `<i>T</i><span>text</span>`,
        attributes: {class: `block`},
        category: category.basic,
        content: {
            type: "text",
            tagName: "p",
            content: `this is a paragraph `,
            draggable: true,
            droppable: true,
        },

    });


    editor.Blocks.add(`link`, {
        label: `<i class="fa fa-link"></i><span>link</span>`,
        attributes: {class: `block`},
        category: category.basic,

        content: {
            type: "link",
            tagName: `a`,
            attributes: {class: "blocks"},
            content: `Link`,
            draggable: true,
            droppable: true,

        },
    });
    editor.Blocks.add(`miz-link`, {
        label: `<i class="fa fa-link"></i><span>miz link</span>`,
        attributes: {class: `block`},
        category: category.basic,

        content: {
            type: "link",
            tagName: `p`,
            attributes: {class: "d-none"},
            content: `Link`,
            draggable: true,
            droppable: true,

        },
    });


    editor.Blocks.add("image", {
        label: `<i class="fa fa-image"></i><span>image</span>`,
        attributes: {class: "block"},
        draggable: true,
        category: category.basic,
        tagName: "img",
        content: `<img />`,
        type: "image"
    });

    editor.Blocks.add("video", {
        label: `<i class="fa fa-play"></i><span>video</span>`,
        attributes: {class: "block"},
        category: category.basic,

        content: {
            type: "video",
            tagName: "video",
            attributes: {'allowfullscreen': "allowfullscreen", controls: true},
        }

    })

    editor.Blocks.add("map", {
        label: `<i class="fa fa-map"></i><span>map</span>`,
        attributes: {class: "block"},
        category: category.basic,

        content: {
            type: "map",
            tagName: "iframe",
            attributes: {
                'frameborder': "0",
                'src': "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d861.272843549974!2d57.06735306954719!3d30.291460256430028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f02184bfc0355cd%3A0xce133debff159061!2sEsperlos!5e0!3m2!1sen!2sae!4v1720520144670!5m2!1sen!2sae",
                'width': "600",
                'height': "350",
                'loading': "lazy",
                'referrerpolicy': "no-referrer-when-downgrade",
            },

        }
    });


    editor.Blocks.add(`link_block`, {
        label: `<i class="fa fa-paperclip"></i><span>link block</span>`,
        attributes: {class: `block`},
        category: category.basic,

        content: {
            type: "link",
            tagName: `a`,
            attributes: {class: "blocks"},
            content: ``,
            draggable: true,
            droppable: true,

        },
    });

    editor.Blocks.add("quote", {
        label: `<i class="fa fa-quote-right"></i><span>quote</span>`,
        attributes: {class: "block"},
        category: category.basic,
        content: {
            type: "text",
            tagName: 'blockquote',
            attributes: {class: "quote"},
            content: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit",
        }

    })

    editor.Blocks.add("text_section", {
        label: `<i class="fa fa-align-center"></i><span>text section</span>`,
        attributes: {class: "block"},
        category: category.basic,

        content: {
            tagName: "section",
            attributes: {class: "bdg-sect"},
            components: [
                {
                    tagName: "h1",
                    type: "text",
                    attributes: {class: "heading"},
                    content: `insert title here`
                },
                {
                    tagName: "p",
                    type: "text",
                    attributes: {class: "paragraph"},
                    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`
                }
            ]
        }
    })


    Object.keys(componentJson).forEach(key => {
        const componentCode = componentJson[key].code;
        const componentName = key.replace('.html', '');    
        try {
            editor.Blocks.add(key, {
                label: `${componentJson[key].icon}<span>${componentName}</span>`,
                attributes: {class: "flex"},
                category: category.components,
                content: componentCode
            });
        } catch (error) {}
    });

    editor.Blocks.add(`h1`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 1</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h1`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 1`,
            draggable: true,
            droppable: true,
        },

    });


    editor.Blocks.add(`hossein`, {
        label: `<i class="fa-solid fa-heading"></i><span>hossein</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h1`,
            type: "hotest",
            attributes: {class: "blocks"},
            content: ` this is header 1`,
            draggable: true,
            droppable: true,
        },

    });



    editor.Blocks.add(`h2`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 2</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h2`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 2`,
            draggable: true,
            droppable: true,
        },
    });


    editor.Blocks.add(`h3`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 3</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h3`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 3`,
            draggable: true,
            droppable: true,
        },
    });

    editor.Blocks.add(`h4`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 4</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h4`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 4`,
            draggable: true,
            droppable: true,
        },

    });


    editor.Blocks.add(`h5`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 5</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h5`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 5`,
            draggable: true,
            droppable: true,
        },

    });


    editor.Blocks.add(`h6`, {
        label: `<i class="fa-solid fa-heading">H</i><span>heading 6</span>`,
        attributes: {class: `block`},
        category: category.heading,

        content: {
            tagName: `h6`,
            type: "text",
            attributes: {class: "blocks"},
            content: ` this is header 6`,
            draggable: true,
            droppable: true,
        },

    });


}


export {base_blocks}