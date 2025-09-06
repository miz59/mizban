import fs from 'fs';
import path from 'path';
import { config } from '../../../../miz/themes/scripts.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, `../../../../miz/themes/${config.theme}/components`);
let componentJson = {};

function extractBodyContent(html) {
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    const match = html.match(bodyRegex);
    if (match && match[1]) {
        return removeIconDiv(match[1].trim());
    }
    return '';
}

function removeIconDiv(content) {
    return content.replace(/<div class="miz-block-icon">[\s\S]*?<\/div>/i, '').trim();
}

function extractIconContent(html) {
    const iconRegex = /<div class="miz-block-icon">([\s\S]*?)<\/div>/i;
    const match = html.match(iconRegex);
    return match && match[1] ? match[1].trim() : '';
}

function processComponentsDir() {
    const firstLevelItems = fs.readdirSync(componentsDir, { withFileTypes: true });

    firstLevelItems.forEach(item => {
        const itemPath = path.join(componentsDir, item.name);

        if (item.isDirectory()) {
            const subItems = fs.readdirSync(itemPath, { withFileTypes: true });

            const folders = subItems.filter(sub => sub.isDirectory());
            const files = subItems.filter(sub => sub.isFile() && sub.name.endsWith('.html'));

            if (folders.length > 0) {
                folders.forEach(subFolder => {
                    const subFolderPath = path.join(itemPath, subFolder.name);

                    const subFiles = fs.readdirSync(subFolderPath, { withFileTypes: true })
                        .filter(f => f.isFile() && f.name.endsWith('.html'));

                    if (subFiles.length > 0) {
                        const firstFile = subFiles[0]; 
                        const filePath = path.join(subFolderPath, firstFile.name);

                        const htmlContent = fs.readFileSync(filePath, 'utf8');
                        componentJson[subFolder.name] = [{
                            code: extractBodyContent(htmlContent),
                            icon: extractIconContent(htmlContent),
                            category: item.name
                        }];
                    }
                });
            }
            else if (files.length > 0) {
                files.forEach(f => {
                    const filePath = path.join(itemPath, f.name);
                    const htmlContent = fs.readFileSync(filePath, 'utf8');
                    componentJson[item.name] = [{
                        code: extractBodyContent(htmlContent),
                        icon: extractIconContent(htmlContent),
                        category: item.name
                    }];
                });
            }
        }
    });

    saveAsJSFile(componentJson);
}

function saveAsJSFile(jsonData) {
    const jsContent = `const componentJson = ${JSON.stringify(jsonData, null, 4)};\nexport default componentJson;`;
    const jsFilePath = path.join(__dirname, 'componentJson.js');

    fs.promises.writeFile(jsFilePath, jsContent, 'utf8')
        .then(() => console.log('💾 componentJson.js created!'))
        .catch(err => console.error('❌ Error writing file:', err));
}

processComponentsDir();