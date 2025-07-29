


function addToPanel(){
    container.append(monacoContainer, resizer, cssMonacoContainer, containerResizer);

}


function initMonacoEditors(mainEditor, monacoContainer, cssMonacoContainer, formatString) {
    if (!window.monacoEditor) {
      window.monacoEditor = monaco.editor.create(monacoContainer, {
        value: mainEditor.getHtml(),
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
      });
      monacoContainer.onkeyup = () => {
        const code = window.monacoEditor.getValue();
        mainEditor.DomComponents.getWrapper().set('content', '');
        mainEditor.setComponents(code.trim());
      };
      window.monacoEditor.onMouseDown(event => {
        const position = event.target.position;
        if (position) {
          const lineNumber = position.lineNumber;
          const lineContent = window.monacoEditor.getModel().getLineContent(lineNumber);
          const selectedComponent = mainEditor.getComponents().find(component =>
            component.toHTML().includes(lineContent.trim())
          );
          if (selectedComponent) {
            mainEditor.select(selectedComponent);
            setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
          }
        }
      });
    } else {
      window.monacoEditor.setValue(mainEditor.getHtml());
    }
  
    if (!window.cssMonacoContainer) {
      window.cssMonacoContainer = monaco.editor.create(cssMonacoContainer, {
        value: formatString(mainEditor.getCss()),
        language: 'css',
        theme: 'vs-dark',
        automaticLayout: true,
        wordWrap: "on",
      });
      cssMonacoContainer.onkeyup = () => {
        const cssCodeValue = window.cssMonacoContainer.getValue();
        mainEditor.setStyle(cssCodeValue);
        mainEditor.store();
      };
    } else {
      window.cssMonacoContainer.setValue(mainEditor.getCss());
    }
  }