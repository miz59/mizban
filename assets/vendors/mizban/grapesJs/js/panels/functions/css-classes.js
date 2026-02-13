export const CSS_FILES = [
    '/assets/vendors/mizban/compile-css/css/miz.min.css',
];

export function extractCSSClasses(cssText) {
    const classNames = new Set();
    const regex = /\.([a-zA-Z][a-zA-Z0-9_-]*)/g;
    let match;

    while ((match = regex.exec(cssText)) !== null) {
        const className = match[1];
        if (isValidCSSClass(className)) {
            classNames.add(className);
        }
    }

    return Array.from(classNames);
}

function isValidCSSClass(className) {
    return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(className) &&
        !className.includes(':');
}

export function filterCSSClasses(cssClasses, searchValue, existingClasses = new Set()) {
    return cssClasses.filter(className => {
        const classNameLower = className.toLowerCase();
        const searchLower = searchValue.toLowerCase();

        if (existingClasses.has(className)) return false;

        if (searchLower.length === 0) return true;
        if (classNameLower.includes(searchLower)) return true;

        return hasSequentialCharacters(classNameLower, searchLower);
    });
}


function hasSequentialCharacters(className, searchValue) {
    let searchIndex = 0;
    for (let i = 0; i < className.length && searchIndex < searchValue.length; i++) {
        if (className[i] === searchValue[searchIndex]) {
            searchIndex++;
        }
    }
    return searchIndex === searchValue.length;
}

export function createMonacoSuggestions(cssClasses, type = 'html') {
    if (type === 'html') {
        return cssClasses.map(className => ({
            label: className,
            kind: window.monaco.languages.CompletionItemKind.Class,
            insertText: className,
            detail: `CSS Class: ${className}`,
            documentation: `CSS class from Mizban framework`
        }));
    }

    return [];
}

export function createSmartHtmlSuggestions(cssClasses, model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    const wordUntilPosition = model.getWordUntilPosition(position);
    const wordRange = new window.monaco.Range(
        position.lineNumber,
        wordUntilPosition.startColumn,
        position.lineNumber,
        wordUntilPosition.endColumn
    );

    const beforeCursor = lineContent.substring(0, position.column - 1);
    const classMatch = beforeCursor.match(/class\s*=\s*["']([^"']*)$/);

    if (!classMatch) {
        return { suggestions: [] };
    }

    const existingClasses = new Set();
    const fullLine = model.getLineContent(position.lineNumber);
    const classAttrMatch = fullLine.match(/class\s*=\s*["']([^"']*)["']/);
    if (classAttrMatch) {
        const classList = classAttrMatch[1].split(/\s+/).filter(c => c.trim());
        classList.forEach(c => existingClasses.add(c.trim()));
    }

    const typedText = wordUntilPosition.word.toLowerCase();
    const filteredClasses = cssClasses.filter(className => {
        const classNameLower = className.toLowerCase();
        const matchesTypedText = classNameLower.includes(typedText);
        const notAlreadyUsed = !existingClasses.has(className);
        return matchesTypedText && notAlreadyUsed;
    });

    return {
        suggestions: filteredClasses.map(className => ({
            label: className,
            kind: window.monaco.languages.CompletionItemKind.Class,
            insertText: className,
            range: wordRange,
            detail: `CSS Class: ${className}`,
            documentation: `CSS class from Mizban framework`
        }))
    };
}

export function extractCSSClassesFromMonaco() {
    if (!window.cssMonacoContainer) {
        return [];
    }

    try {
        const cssCode = window.cssMonacoContainer.getValue();
        return extractCSSClasses(cssCode);
    } catch (error) {
        console.warn('Error extracting CSS classes from Monaco:', error);
        return [];
    }
}

export function getCombinedCSSClasses() {
    return Promise.all([
        getCSSClassesFromFiles(),
        Promise.resolve(extractCSSClassesFromMonaco())
    ]).then(([fileClasses, monacoClasses]) => {
        const allClasses = new Set([...fileClasses, ...monacoClasses]);
        return Array.from(allClasses);
    });
}

export function getCSSClassesFromFiles() {
    return fetchCSSClassesFromArray(CSS_FILES);
}

function fetchCSSClassesFromArray(cssUrls) {
    const allClassNames = new Set();

    const fetchPromises = cssUrls.map(url =>
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(cssText => {
                return extractCSSClasses(cssText);
            })
            .catch(error => {
                console.warn(`CSS file not found or not accessible: ${url}`);
                return [];
            })
    );

    return Promise.all(fetchPromises)
        .then(results => {
            results.forEach(classNames => {
                classNames.forEach(className => allClassNames.add(className));
            });
            return Array.from(allClassNames);
        });
}

export function addCSSFile(cssUrl) {
    if (!CSS_FILES.includes(cssUrl)) {
        CSS_FILES.push(cssUrl);
    }
}

export function removeCSSFile(cssUrl) {
    const index = CSS_FILES.indexOf(cssUrl);
    if (index > -1) {
        CSS_FILES.splice(index, 1);
    }
}

export function getCSSFiles() {
    return [...CSS_FILES];
}
