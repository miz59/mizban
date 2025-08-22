function navigateToComponent(component, mainEditor) {
    if (!window.monacoEditor || !component) {
        return;
    }
    
    // Prevent navigation if sync is in progress
    if (window.isUpdatingFromGrapesJS) {
        return;
    }
    
    try {
        const componentHtml = component.toHTML();
        const monacoContent = window.monacoEditor.getValue();
        
        if (!monacoContent || !componentHtml) {
            return;
        }

        // Check if we have a stored click position for this component
        let targetPosition = null;
        
        // First try to find by ID
        const idMatch = componentHtml.match(/id=["']([^"']+)["']/);
        if (idMatch) {
            const specificId = idMatch[1];
            const specificTagRegex = new RegExp(`<[^>]*id=["']${specificId}["'][^>]*>`, 'g');
            const matches = [...monacoContent.matchAll(specificTagRegex)];

            if (matches.length > 0) {
                const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);
                
                // If we have a stored click position for this component, use it
                if (window.lastClickPosition && window.lastClickPosition.componentId === specificId) {
                    targetPosition = window.lastClickPosition.position;
                } else {
                    // Otherwise use the start of the tag
                    targetPosition = tagPosition;
                }
                
                highlightComponentInMonaco(targetPosition);
                return;
            }
        }
        
        // If no ID found or ID not found in Monaco, try by tag name
        const tagMatch = componentHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/);
        if (tagMatch) {
            const tagName = tagMatch[1];
            const tagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
            const matches = [...monacoContent.matchAll(tagRegex)];

            if (matches.length > 0) {
                const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);
                
                // If we have a stored click position for this tag, use it
                if (window.lastClickPosition && window.lastClickPosition.tagName === tagName) {
                    targetPosition = window.lastClickPosition.position;
                } else {
                    // Otherwise use the start of the tag
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
        
        // Add visual highlight
        const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column + 1
        };
        
        // Clear previous decorations
        if (window.currentComponentDecoration) {
            window.monacoEditor.deltaDecorations([window.currentComponentDecoration], []);
        }
        
        // Add new decoration
        window.currentComponentDecoration = window.monacoEditor.deltaDecorations([], [{
            range: range,
            options: {
                inlineClassName: 'component-highlight',
                isWholeLine: true
            }
        }]);
        
        // Remove highlight after 2 seconds
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
    // Add CSS for component highlighting
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
        // Clean up old click positions (older than 5 seconds)
        if (window.lastClickPosition && (Date.now() - window.lastClickPosition.timestamp) > 5000) {
            window.lastClickPosition = null;
        }
        
        // Add a small delay to prevent conflicts with sync
        setTimeout(() => {
            navigateToComponent(component, mainEditor);
        }, 50);
    });
}

export { navigateToComponent, setupComponentNavigation };