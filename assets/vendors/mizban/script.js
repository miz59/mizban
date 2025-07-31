const body = document.body;
const head = document.head;

// Add CSS files to head
const link1 = document.createElement('link');
link1.rel = 'stylesheet';
link1.href = 'assets/vendors/mizban/grapesJs/css/grapesJs.css';
head.appendChild(link1);

const link2 = document.createElement('link');
link2.rel = 'stylesheet';
link2.href = 'assets/vendors/mizban/grapesJs/css/editor.css';
head.appendChild(link2);

const script1 = document.createElement('script');
script1.src = 'assets/vendors/mizban/grapesJs/grapesJs.js';

script1.onload = () => {
    const script2 = document.createElement('script');
    script2.src = 'assets/vendors/mizban/grapesJs/js/editor/editor.js';
    script2.type = 'module';
    body.appendChild(script2);

    script2.onload = () => {
        const script3 = document.createElement('script');
        script3.src = './assets/vendors/mizban/playground/monaco-config.js';
        body.appendChild(script3);
        
        script3.onload = () => {
            const script4 = document.createElement('script');
            script4.src = './assets/vendors/mizban/playground/loader.min.js';
            body.appendChild(script4);
        };
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