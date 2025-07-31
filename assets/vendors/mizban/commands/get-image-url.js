import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesFolder = path.join(__dirname, '../../../media/images');

const getImageUrls = () => {

    if (!fs.existsSync(imagesFolder)) {
        console.error('The images folder does not exist at the given path!');
        return [];
    }

    const files = fs.readdirSync(imagesFolder);

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
    const imageUrls = files
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map(file => `./assets/media/images/${file}`);
    
    return imageUrls;
};

const saveImageUrlsToJs = () => {
    const imageUrls = getImageUrls();
    if (imageUrls.length === 0) {
        console.log('No images found in the folder.');
        return;
    }
    const jsFilePath = path.join(__dirname, 'imageUrls.js'); 
    const jsContent = `const imageUrls = ${JSON.stringify(imageUrls, null, 2)};\nexport default imageUrls;`;

    fs.writeFileSync(jsFilePath, jsContent, 'utf-8');
    console.log('JavaScript file has been created successfully!');
};

saveImageUrlsToJs();
