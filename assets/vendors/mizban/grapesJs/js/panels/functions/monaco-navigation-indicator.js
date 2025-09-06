function navigateToComponent(component, mainEditor) {
    if (!window.monacoEditor || !component) return;

    window.isNavigatingFromGrapes = true;

    try {
        const componentHtml = component.toHTML();
        const monacoContent = window.monacoEditor.getValue();
        if (!monacoContent || !componentHtml) return;

        let targetPosition = null;
        const idMatch = componentHtml.match(/id=["']([^"']+)["']/);
        if (idMatch) {
            const specificId = idMatch[1];
            const specificTagRegex = new RegExp(`<[^>]*id=["']${specificId}["'][^>]*>`, 'g');
            const matches = [...monacoContent.matchAll(specificTagRegex)];

            if (matches.length > 0) {
                const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);
                targetPosition = tagPosition;
                highlightComponentInMonaco(targetPosition);
                return;
            }
        }

    } catch (error) {
        console.error('Error navigating to component in Monaco:', error);
    } finally {
        setTimeout(() => {
            window.isNavigatingFromGrapes = false;
        }, 300);
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
        if (window.isNavigatingFromMonaco === true) {
            return;
        }

        window.isHighlightOnly = true;
        setTimeout(() => { window.isHighlightOnly = false; }, 500);

        setTimeout(() => {
            navigateToComponent(component, mainEditor);
        }, 50);
    });
}

export { navigateToComponent, setupComponentNavigation };