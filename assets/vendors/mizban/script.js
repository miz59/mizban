const body = document.body;

const script1 = document.createElement('script');
script1.src = 'assets/vendors/mizban/grapesJs/grapesJs.js';

// Load editor.js only after grapesJs.js is loaded
script1.onload = () => {
    const script2 = document.createElement('script');
    script2.src = 'assets/vendors/mizban/grapesJs/js/editor/editor.js';
    script2.type = 'module';
    body.appendChild(script2);

    script2.onload = () => {
        const script3 = document.createElement('script');
        script3.src = './assets/vendors/playground/loader.min.js';
        body.appendChild(script3);
    };
};

body.appendChild(script1);


function wrapBodyContent() {
    const scriptTag = document.querySelector('script[src="./assets/vendors/mizban/script.js"]');
    if (scriptTag) {
        const canvasDiv = document.createElement('div');
        canvasDiv.id = 'canvas';
        while (document.body.firstChild) {
            canvasDiv.appendChild(document.body.firstChild);
        }
        document.body.appendChild(canvasDiv);
    }
}

wrapBodyContent();