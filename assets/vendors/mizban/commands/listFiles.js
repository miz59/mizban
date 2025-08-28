import fs from 'fs';
import path from 'path';
import config from '../../../../miz/themes/scripts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, `../../../../miz/themes/${config.theme}/components`);

let componentJson = {};

// Function to recursively find all HTML files
function findHtmlFiles(dir) {
  let htmlFiles = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        htmlFiles = htmlFiles.concat(findHtmlFiles(itemPath));
      } else if (item.endsWith('.html')) {
        // Add HTML files with their relative path
        htmlFiles.push(itemPath);
      }
    });
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error);
  }
  
  return htmlFiles;
}

// Process all HTML files
async function processHtmlFiles() {
  console.log('🔍 Scanning for HTML files in components directory...');
  
  const htmlFiles = findHtmlFiles(directoryPath);
  console.log(`📁 Found ${htmlFiles.length} HTML files to process`);
  
  for (const filePath of htmlFiles) {
    try {
      const relativePath = path.relative(directoryPath, filePath);
      const formattedName = formatFileName(relativePath);
      
      console.log(`📝 Processing: ${relativePath}`);
      
      const data = await fs.promises.readFile(filePath, 'utf8');
      const bodyContent = extractBodyContent(data);
      const iconContent = extractIconContent(data);

      componentJson[formattedName] = { 
        code: bodyContent,
        icon: iconContent 
      };
      
      console.log(`✅ Processed: ${formattedName}`);
    } catch (error) {
      console.error(`❌ Error processing file ${filePath}:`, error);
    }
  }
  
  console.log(`🎉 All files processed! Total components: ${Object.keys(componentJson).length}`);
  saveAsJSFile(componentJson);
}

// Start processing
processHtmlFiles().catch(err => console.error('❌ Error in main process: ', err));

function formatFileName(filePath) {
  // Remove the .html extension
  const nameWithoutExtension = filePath.replace(/\.[^/.]+$/, "");
  
  // Split by path separator and get the last part (filename)
  const pathParts = nameWithoutExtension.split(path.sep);
  const fileName = pathParts[pathParts.length - 1];
  
  // Format the filename
  const withSpaces = fileName.replace(/-/g, ' ');
  const formatted = withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // If there are parent directories, include them in the name
  if (pathParts.length > 1) {
    const parentDir = pathParts[pathParts.length - 2];
    return `${parentDir} ${formatted}`;
  }
  
  return formatted;
}

function extractBodyContent(html) {
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const match = html.match(bodyRegex);
  if (match && match[1]) {
    const bodyContent = match[1].trim();
    return removeIconDiv(bodyContent);
  }
  return ''; 
}

function removeIconDiv(content) {
  const iconDivRegex = /<div class="miz-block-icon">[\s\S]*?<\/div>/i;
  return content.replace(iconDivRegex, '').trim();
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
    .then(() => console.log(`💾 File saved as componentJson.js`))
    .catch(err => console.error('❌ Error writing to file: ', err));
}