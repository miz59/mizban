import fs from 'fs';
import path from 'path';
import { config } from '../../../../miz/themes/scripts.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, `../../../../miz/themes/${config.theme}/components`);
let componentJson = {};

// استخراج محتوا از تگ <body>
function extractBodyContent(html) {
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    const match = html.match(bodyRegex);
    if (match && match[1]) {
        return removeIconDiv(match[1].trim());
    }
    return '';
}

// حذف div مخصوص آیکون
function removeIconDiv(content) {
    return content.replace(/<div class="miz-block-icon">[\s\S]*?<\/div>/i, '').trim();
}

// استخراج محتوا برای آیکون
function extractIconContent(html) {
    const iconRegex = /<div class="miz-block-icon">([\s\S]*?)<\/div>/i;
    const match = html.match(iconRegex);
    return match && match[1] ? match[1].trim() : '';
}

// پردازش پوشه‌ها و فایل‌ها
function processComponentsDir() {
    const firstLevelItems = fs.readdirSync(componentsDir, { withFileTypes: true });

    firstLevelItems.forEach(item => {
        const itemPath = path.join(componentsDir, item.name);

        if (item.isDirectory()) {
            const subItems = fs.readdirSync(itemPath, { withFileTypes: true });

            const folders = subItems.filter(sub => sub.isDirectory());
            const files = subItems.filter(sub => sub.isFile() && sub.name.endsWith('.html'));

            if (folders.length > 0) {
                // اولویت با پوشه → فقط پوشه‌ها را اضافه می‌کنیم
                folders.forEach(subFolder => {
                    const subFolderPath = path.join(itemPath, subFolder.name);

                    // فایل‌های مستقیم داخل این پوشه سطح دوم
                    const subFiles = fs.readdirSync(subFolderPath, { withFileTypes: true })
                        .filter(f => f.isFile() && f.name.endsWith('.html'));

                    if (subFiles.length > 0) {
                        const firstFile = subFiles[0]; // اگر چند فایل هست فقط اولین فایل را اضافه می‌کنیم
                        const filePath = path.join(subFolderPath, firstFile.name);

                        const htmlContent = fs.readFileSync(filePath, 'utf8');
                        componentJson[subFolder.name] = [{
                            code: extractBodyContent(htmlContent),
                            icon: extractIconContent(htmlContent),
                            category: item.name
                        }];
                    }
                    // اگر پوشه سطح دوم هیچ فایل HTML نداشته باشد → نادیده گرفته می‌شود
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
        // else if (item.isFile() && item.name.endsWith('.html')) {
        //     const filePath = itemPath;
        //     const nameWithoutExt = path.basename(item.name, '.html');

        //     const htmlContent = fs.readFileSync(filePath, 'utf8');
        //     componentJson[nameWithoutExt] = [{
        //         code: extractBodyContent(htmlContent),
        //         icon: extractIconContent(htmlContent),
        //         category: 'components'
        //     }];
        // }
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