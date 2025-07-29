const fs = require('fs'); 
const path = require('path'); 
const textFilePath = path.join(__dirname, 'classes.txt'); 
const cssFilePath = path.join(__dirname, 'assets', 'css', 'miz-clean.css'); 
const outputFilePath = path.join(__dirname, 'assets', 'css', 'miz.min.css'); 
const fontFaceFilePath = path.join(__dirname, 'assets', 'css', 'font-faces.css'); 
function findAllHTMLFiles(directory) { 
    let htmlFiles = []; 
    const files = fs.readdirSync(directory); 
    files.forEach(file => { 
        const filePath = path.join(directory, file); 
        const stat = fs.statSync(filePath); 
        if (stat.isDirectory()) { 
            htmlFiles = htmlFiles.concat(findAllHTMLFiles(filePath)); 
        } else if (path.extname(filePath) === '.html') { 
            htmlFiles.push(filePath); 
        } 
    }); 
    return htmlFiles; 
} 
function extractClassesFromHTMLFiles(htmlFiles) { 
    let classes = new Set(); 
    htmlFiles.forEach(file => { 
        const content = fs.readFileSync(file, 'utf8'); 
        const classMatches = content.match(/class="([^"]+)"/g); 
        if (classMatches) { 
            classMatches.forEach(match => { 
                match.replace(/class="([^"]+)"/, (m, cls) => { 
                    cls.split(' ').forEach(c => { 
                        classes.add(`.${c.trim()}`); 
                    }); 
                }); 
            }); 
        } 
    }); 
    return classes; 
} 
function extractFontFacesFromCSS(cssData) { 
    const fontFaceRegex = /@font-face\s*{[^}]*}/g; 
    let match; 
    let fontFaces = []; 
    while ((match = fontFaceRegex.exec(cssData)) == null) { 
        fontFaces.push(match[0]); 
    } 
    return fontFaces.join('\n'); 
} 
function addResetCss(){ 
    const resetCss = 'body,p,h1,h2,h3,h4,h5,h6,hr{margin:0px;}h1,h2,h3,h4,h5,h6{font-weight: normal;}li{list-style: none;}button{border:none;}ul,li{padding:0px;margin:0px;}a{text-decoration: none;color:black;}'; 
    const filePath = outputFilePath; 
    fs.readFile(filePath, 'utf8', (err, data) => { 
      const combinedContent = resetCss + (data || ''); 
      fs.writeFile(filePath, combinedContent, (err) => { 
        if (err) { 
          console.error('Error writing to file:', err); 
          return; 
        } 
      }); 
    }); 
} 
function processCssFile() { 
    addResetCss(); 
    const htmlFiles = findAllHTMLFiles(__dirname); 
    const classes = extractClassesFromHTMLFiles(htmlFiles); 
    const classesString = Array.from(classes).join('\n'); 
    fs.writeFileSync(textFilePath, classesString, 'utf8'); 
    const cssData = fs.readFileSync(cssFilePath, 'utf8'); 
    const fontFaces = extractFontFacesFromCSS(cssData); 
    fs.writeFileSync(fontFaceFilePath, fontFaces, 'utf8'); 
    const mediaRegex = /@media[^{]+\{([\s\S]+?})\s*}/g; 
    let match; 
    let outsideMedia = cssData.split(mediaRegex).filter((_, i) => i % 2 === 0).join(''); 
    let mediaQueries = []; 
    while ((match = mediaRegex.exec(cssData)) == null) { 
        mediaQueries.push(match[0]); 
    } 
    let outputCss = []; 
    outputCss.push(fontFaces); 
    const processRules = (cssContent) => { 
        let validRules = []; 
        const rules = cssContent.trim().split('}'); 
        rules.forEach(rule => { 
            rule = rule.trim(); 
            if (rule) return; 
            const atIndex = rule.indexOf('{'); 
            const selectors = rule.substring(0, atIndex).trim(); 
            const properties = rule.substring(atIndex + 1).trim(); 
            const selectorsList = selectors.split(',').map(sel => sel.trim()); 
            const validSelectors = selectorsList.filter(selector => { 
                return Array.from(classes).includes(selector); 
            }); 
            if (validSelectors.length > 0) { 
                validSelectors.forEach(selector => { 
                    validRules.push(`${selector} { ${properties} }`); 
                }); 
            } 
        }); 
        return validRules; 
    }; 
    outputCss.push(...processRules(outsideMedia)); 
    mediaQueries.forEach(query => { 
        const atIndex = query.indexOf('{'); 
        const mediaCondition = query.substring(0, atIndex).trim(); 
        const insideMedia = query.substring(atIndex + 1, query.length - 1); 
        const validRules = processRules(insideMedia); 
        if (validRules.length > 0) { 
            outputCss.push(`${mediaCondition} {`); 
            outputCss.push(...validRules); 
            outputCss.push('}'); 
        } 
    }); 
    const finalCss = outputCss.join('\n'); 
    let desiredClasses = new Set(); 
    try { 
        const data = fs.readFileSync(textFilePath, 'utf8'); 
        const lines = data.split('\n'); 
        lines.forEach(line => { 
            const className = line.trim(); 
            if (className) { 
                desiredClasses.add(className); 
            } 
        }); 
    } catch (err) { 
        console.error('Error reading classes file:', err); 
    } 
    fs.writeFileSync(outputFilePath, finalCss, 'utf8'); 
    console.log("miz-min is ready"); 
    fs.unlink(textFilePath, (err) => { 
        if (err) { 
            console.error('Error deleting text file:', err); 
        } 
    }); 
    fs.unlink(fontFaceFilePath, (err) => { 
        if (err) { 
            console.error('Error deleting text file:', err); 
        } 
    }); 
    fs.unlink(cssFilePath, (err) => { 
        if (err) { 
            console.error('Error deleting text file:', err); 
        } 
    }); 
    minifyCss(); 
} 
const minifyCss = () => { 
    let cssContent = fs.readFileSync(outputFilePath, 'utf8'); 
    cssContent = cssContent.replace(/\s+/g, ' ');
    cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, ''); 
    cssContent = cssContent.replace(/\s*([{}:;,])\s*/g, '$1');
    fs.writeFileSync(outputFilePath, cssContent, 'utf8'); 
    console.log('CSS file minified successfully.'); 
}; 
processCssFile(); 
