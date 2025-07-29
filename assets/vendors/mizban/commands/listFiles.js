import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../components');

let componentJson = {};

fs.promises.readdir(directoryPath)
  .then(files => {
    return Promise.all(files.map(file => {
      const filePath = path.join(directoryPath, file);
      const formattedName = formatFileName(file);

      return fs.promises.readFile(filePath, 'utf8')
        .then(data => {
          const bodyContent = extractBodyContent(data);
          const iconContent = extractIconContent(data);

          componentJson[formattedName] = { 
            code: bodyContent,
            icon: iconContent 
          };
        })
        .catch(err => console.error(`Error reading file ${file}: `, err));
    }));
  })
  .then(() => {
    saveAsJSFile(componentJson);
  })
  .catch(err => console.error('Unable to scan directory: ', err));

function formatFileName(fileName) {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const withSpaces = nameWithoutExtension.replace(/-/g, ' ');
  return withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function extractBodyContent(html) {
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const match = html.match(bodyRegex);
  if (match && match[1]) {
    const bodyContent = match[1].trim();
    return removeIconDiv(bodyContent); // حذف div miz-block-icon
  }
  return ''; 
}

function removeIconDiv(content) {
  const iconDivRegex = /<div class="miz-block-icon">[\s\S]*?<\/div>/i;
  return content.replace(iconDivRegex, '').trim(); // حذف div و trim
}

function extractIconContent(html) {
  const iconRegex = /<div class="miz-block-icon">([\s\S]*?)<\/div>/i;
  const match = html.match(iconRegex);
  return match && match[1] ? match[1].trim() : ''; 
}

function saveAsJSFile(jsonData) {
  const jsContent = `const componentJson = ${JSON.stringify(jsonData, null, 2)}; \n export default componentJson;`;
  const jsFilePath = path.join(__dirname, 'componentJson.js');

  fs.promises.writeFile(jsFilePath, jsContent, 'utf8')
    .then(() => console.log(`File saved as componentJson.js`))
    .catch(err => console.error('Error writing to file: ', err));
}
