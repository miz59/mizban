import { promises as fs } from 'fs';
const scssFiles = [`${process.cwd()}/miz/sass/config/_responsive.scss`];
const variableNames = ['$conf-cols','$break-points',];

function toCamelCase(str) {
  return str
    .replace(/-./g, match => match.charAt(1).toUpperCase())
    .replace(/^\w/, c => c.toLowerCase());
}

async function extractScssVariables() {
  const variables = {};
  
  try {
    for (const file of scssFiles) {
      const data = await fs.readFile(file, 'utf-8');

      const variableRegex = /\$([\w-]+):\s*([^;]+);/g;
      const mapRegex = /\$break-points:\s*\(([^)]+)\);/;

      let match;
      while ((match = variableRegex.exec(data)) !== null) {
        const key = `$${match[1].trim()}`;
        let value = match[2].trim();

        value = value.replace(/(\d+)(px|rem)/g, '"$1$2"'); 
        if (value.startsWith('(') && value.endsWith(')')) {
          value = `{ ${value.slice(1, -1).replace(/:/g, ': ')} }`;
        }

        if (variableNames.includes(key)) {
          variables[toCamelCase(key.slice(1))] = value; 
        }
      }

      const mapMatch = data.match(mapRegex);
      if (mapMatch) {
        const mapContent = mapMatch[1].trim();
        const entries = mapContent.split(',').map(entry => {
          const [key, value] = entry.split(':').map(str => str.trim());
          return `"${toCamelCase(key)}": "${value.trim()}"`; 
        });
        variables['breakPoints'] = `{ ${entries.join(', ')} }`;
      }
    }

    const jsContent = Object.entries(variables)
      .map(([key, value]) => `export const ${key} = ${value};`)
      .join('\n');
    await fs.writeFile(`${process.cwd()}/assets/vendors/mizban/commands/variables.js`, jsContent);
    console.log('SCSS variables extracted to variables.js');
  } catch (err) {
    console.error('Error reading or writing files:', err);
  }
}

extractScssVariables();
