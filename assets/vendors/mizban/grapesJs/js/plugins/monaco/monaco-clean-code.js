function formatHtmlCode(html) {
    let result = '';
    let indentLevel = 0;
    let i = 0;
    const indent = (lvl) => '    '.repeat(lvl);

    while (i < html.length) {
    while (html[i] === '\n' || html[i] === '\r') i++;
    if (html[i] === '<') {
        if (html.startsWith('<!--', i)) {
        let end = html.indexOf('-->', i + 4);
        if (end === -1) end = html.length - 1;
        const comment = html.slice(i, end + 3);
        result += '\n' + indent(indentLevel) + comment;
        i = end + 3;
        continue;
        }
        if (html[i + 1] === '/') {
        indentLevel = Math.max(0, indentLevel - 1);
        let end = html.indexOf('>', i);
        const tag = html.slice(i, end + 1);
        result += '\n' + indent(indentLevel) + tag;
        i = end + 1;
        continue;
        }
        let end = html.indexOf('>', i);
        let tag = html.slice(i, end + 1);
        const isSelfClosing = tag.endsWith('/>');
        
        if (isSelfClosing) {
        result += '\n' + indent(indentLevel) + tag;
        i = end + 1;
        continue;
        }
        
        const tagNameMatch = tag.match(/^<([a-zA-Z0-9\-]+)/);
        if (tagNameMatch) {
            const tagName = tagNameMatch[1];
            const closingTag = `</${tagName}>`;
            const closingTagIndex = html.indexOf(closingTag, end + 1);
            
            if (closingTagIndex !== -1) {
                const content = html.slice(end + 1, closingTagIndex);
                const trimmedContent = content.trim();
                const hasChildTags = trimmedContent.includes('<') && trimmedContent.indexOf('<') < trimmedContent.lastIndexOf('>');
                
                if (!hasChildTags) {
                    result += '\n' + indent(indentLevel) + tag + trimmedContent + closingTag;
                    i = closingTagIndex + closingTag.length;
                    continue;
                }
            }
        }
        
        result += '\n' + indent(indentLevel) + tag;
        i = end + 1;
        indentLevel++;
        continue;
    }
    let nextTag = html.indexOf('<', i);
    let text = (nextTag === -1 ? html.slice(i) : html.slice(i, nextTag)).trim();
    if (text) {
        result += '\n' + indent(indentLevel) + text;
    }
    i = nextTag === -1 ? html.length : nextTag;
    }
    return result.replace(/^\n+/, '');
}

function formatCssCode(css) {
    css = css.replace(/:\s+([a-zA-Z-]+)/g, ':$1');
    css = css.replace(/\s*{\s*/g, ' {\n');
    css = css.replace(/\s*}\s*/g, '\n}\n');
    css = css.replace(/(^|\n)\s*([^{\n]+?)\s*{/, (m, p1, p2) => `\n${p2.trim()} {`);

    let lines = css.split(/\n+/).map(line => line.trim()).filter(Boolean);
    let result = '';
    let indentLevel = 0;

    for (let line of lines) {
        if (line.endsWith('{')) {
            result += '    '.repeat(indentLevel) + line + '\n';
            indentLevel++;
        } else if (line === '}') {
            indentLevel--;
            result += '    '.repeat(indentLevel) + '}\n\n';
        } else {
            result += '    '.repeat(indentLevel) + line + '\n';
        }
    }

    return result.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}


export { formatHtmlCode, formatCssCode };