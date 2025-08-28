import fs from 'fs';
import path from 'path';
import { config } from '../../../../miz/themes/scripts.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر پوشه components
const directoryPath = path.join(__dirname, `../../../../miz/themes/${config.theme}/components`);

let componentJson = {};

// پیدا کردن تمام فایل‌های HTML به صورت بازگشتی
function findHtmlFiles(dir) {
  let htmlFiles = [];
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        htmlFiles = htmlFiles.concat(findHtmlFiles(itemPath));
      } else if (item.endsWith('.html')) {
        htmlFiles.push(itemPath);
      }
    });
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error);
  }
  return htmlFiles;
}

// پردازش تمام فایل‌های HTML
async function processHtmlFiles() {
  console.log('🔍 Scanning for HTML files in components directory...');
  const htmlFiles = findHtmlFiles(directoryPath);
  console.log(`📁 Found ${htmlFiles.length} HTML files to process`);

  for (const filePath of htmlFiles) {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const bodyContent = extractBodyContent(data);
      const iconContent = extractIconContent(data);

      addToJsonByFolders(filePath, { code: bodyContent, icon: iconContent });

      console.log(`✅ Processed: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error processing file ${filePath}:`, error);
    }
  }

  console.log(`🎉 All files processed! Total components: ${Object.keys(componentJson).length}`);
  saveAsJSFile(componentJson);
}

function addToJsonByFolders(filePath, content) {
    const relativePath = path.relative(directoryPath, filePath);
    const parts = relativePath.split(path.sep); // مسیر به آرایه

    let componentName = parts[parts.length - 2] || parts[0]; // پوشه آخر قبل از فایل
    let category;

    if (parts.length === 1) {
        // فایل مستقیم در components
        category = 'components';
    } else if (parts.length === 2) {
        // فایل در پوشه سطح اول
        category = 'components';
    } else {
        // فایل در زیرپوشه
        category = parts[parts.length - 3]; // parent مستقیم پوشه component
    }

    if (!componentJson[componentName]) componentJson[componentName] = [];

    componentJson[componentName].push({
        code: content.code,
        icon: content.icon,
        category
    });
}

// استخراج محتوا از تگ <body>
function extractBodyContent(html) {
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const match = html.match(bodyRegex);
  if (match && match[1]) {
    const bodyContent = match[1].trim();
    return removeIconDiv(bodyContent);
  }
  return ''; 
}

// حذف div مخصوص آیکون از محتوا
function removeIconDiv(content) {
  const iconDivRegex = /<div class="miz-block-icon">[\s\S]*?<\/div>/i;
  return content.replace(iconDivRegex, '').trim();
}

// استخراج محتوا برای آیکون
function extractIconContent(html) {
  const iconRegex = /<div class="miz-block-icon">([\s\S]*?)<\/div>/i;
  const match = html.match(iconRegex);
  return match && match[1] ? match[1].trim() : ''; 
}

// ذخیره JSON به صورت فایل JS
function saveAsJSFile(jsonData) {
  const jsContent = `const componentJson = ${JSON.stringify(jsonData, null, 4)}; \n export default componentJson;`;
  const jsFilePath = path.join(__dirname, 'componentJson.js');

  fs.promises.writeFile(jsFilePath, jsContent, 'utf8')
    .then(() => console.log(`💾 File saved as componentJson.js`))
    .catch(err => console.error('❌ Error writing to file: ', err));
}

// اجرای پردازش
processHtmlFiles().catch(err => console.error('❌ Error in main process: ', err));