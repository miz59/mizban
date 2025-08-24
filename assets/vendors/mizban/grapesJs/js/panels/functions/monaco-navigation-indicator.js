function navigateToComponent(component, mainEditor) {
    if (!window.monacoEditor || !component) {
        return;
    }
    
    if (window.isUpdatingFromGrapesJS) {
        return;
    }
    
    try {
        const componentHtml = component.toHTML();
        const monacoContent = window.monacoEditor.getValue();
        
        if (!monacoContent || !componentHtml) {
            return;
        }

        let targetPosition = null;
        
        const idMatch = componentHtml.match(/id=["']([^"']+)["']/);
        if (idMatch) {
            const specificId = idMatch[1];
            const specificTagRegex = new RegExp(`<[^>]*id=["']${specificId}["'][^>]*>`, 'g');
            const matches = [...monacoContent.matchAll(specificTagRegex)];

            if (matches.length > 0) {
                const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);
                
                if (window.lastClickPosition && window.lastClickPosition.componentId === specificId) {
                    targetPosition = window.lastClickPosition.position;
                } else {
                    targetPosition = tagPosition;
                }
                
                highlightComponentInMonaco(targetPosition);
                return;
            }
        }
        
        const tagMatch = componentHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/);
        if (tagMatch) {
            const tagName = tagMatch[1];
            const tagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
            const matches = [...monacoContent.matchAll(tagRegex)];

            if (matches.length > 0) {
                const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);
                
                if (window.lastClickPosition && window.lastClickPosition.tagName === tagName) {
                    targetPosition = window.lastClickPosition.position;
                } else {
                    targetPosition = tagPosition;
                }
                
                highlightComponentInMonaco(targetPosition);
                return;
            }
        }
        
        console.warn('Component not found in Monaco editor');
        
    } catch (error) {
        console.error('Error navigating to component in Monaco:', error);
    }
}

function highlightComponentInMonaco(position) {
    try {
        window.monacoEditor.setPosition({
            lineNumber: position.lineNumber,
            column: position.column
        });

        window.monacoEditor.focus();
        window.monacoEditor.revealPositionInCenter({
            lineNumber: position.lineNumber,
            column: position.column
        });
        
        const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column + 1
        };
        
        if (window.currentComponentDecoration) {
            window.monacoEditor.deltaDecorations([window.currentComponentDecoration], []);
        }
        
        window.currentComponentDecoration = window.monacoEditor.deltaDecorations([], [{
            range: range,
            options: {
                inlineClassName: 'component-highlight',
                isWholeLine: true
            }
        }]);
        
        setTimeout(() => {
            if (window.currentComponentDecoration) {
                window.monacoEditor.deltaDecorations([window.currentComponentDecoration], []);
                window.currentComponentDecoration = null;
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error highlighting component:', error);
    }
}

function setupComponentNavigation(mainEditor) {
    if (!document.getElementById('monaco-component-highlight-style')) {
        const style = document.createElement('style');
        style.id = 'monaco-component-highlight-style';
        style.textContent = `
            .component-highlight {
                background-color: rgb(255, 0, 0) !important;
                border-left: 3px solid rgb(255, 0, 0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    mainEditor.on('component:selected', (component) => {
        if (window.lastClickPosition && (Date.now() - window.lastClickPosition.timestamp) > 5000) {
            window.lastClickPosition = null;
        }
        
        setTimeout(() => {
            navigateToComponent(component, mainEditor);
        }, 50);
    });
}

export { navigateToComponent, setupComponentNavigation };