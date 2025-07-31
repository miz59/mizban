function navigateToComponent(component, mainEditor) {
    if (window.monacoEditor) {
        try {
            const componentHtml = component.toHTML();
            const monacoContent = window.monacoEditor.getValue();

            const idMatch = componentHtml.match(/id="([^"]+)"/);
            if (idMatch) {
                const specificId = idMatch[1];
                const specificTagRegex = new RegExp(`<[^>]*id="${specificId}"[^>]*>`, 'g');
                const matches = [...monacoContent.matchAll(specificTagRegex)];

                if (matches.length > 0) {
                    const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);

                    window.monacoEditor.setPosition({
                        lineNumber: tagPosition.lineNumber,
                        column: tagPosition.column
                    });

                    window.monacoEditor.focus();

                    window.monacoEditor.revealPositionInCenter({
                        lineNumber: tagPosition.lineNumber,
                        column: tagPosition.column
                    });
                } else {
                    const tagMatch = componentHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/);
                    if (tagMatch) {
                        const tagName = tagMatch[1];
                        const tagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
                        const matches = [...monacoContent.matchAll(tagRegex)];

                        if (matches.length > 0) {
                            const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);

                            window.monacoEditor.setPosition({
                                lineNumber: tagPosition.lineNumber,
                                column: tagPosition.column
                            });

                            window.monacoEditor.revealPositionInCenter({
                                lineNumber: tagPosition.lineNumber,
                                column: tagPosition.column
                            });
                        }
                    }
                }
            } else {
                const tagMatch = componentHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/);
                if (tagMatch) {
                    const tagName = tagMatch[1];
                    const tagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
                    const matches = [...monacoContent.matchAll(tagRegex)];

                    if (matches.length > 0) {
                        const tagPosition = window.monacoEditor.getModel().getPositionAt(matches[0].index);

                        window.monacoEditor.setPosition({
                            lineNumber: tagPosition.lineNumber,
                            column: tagPosition.column
                        });

                        window.monacoEditor.revealPositionInCenter({
                            lineNumber: tagPosition.lineNumber,
                            column: tagPosition.column
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error highlighting component in Monaco:', error);
        }
    }
}

function setupComponentNavigation(mainEditor) {
    mainEditor.on('component:selected', (component) => {
        navigateToComponent(component, mainEditor);
    });
}

export { navigateToComponent, setupComponentNavigation };