let cssFileUrl = './assets/vendors/mizban/grapesJs/js/cssRules/cssRules.css';


async function fetchCSSContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching the CSS file:', error);
        return '';
    }
}

const cssContentPromise = fetchCSSContent(cssFileUrl);


function cssRules(editor){
    cssContentPromise.then(value => {
        editor.Css.addRules(value);
    });
}


export {cssRules};
