import setupResizer from './panel-resizer.js';




function render(editor) {
  editor.Commands.add(commandId, {
    run: (mainEditor, sender) => {
      let cssCode = mainEditor.getCss();
      mainEditor.setStyle(cssCode);
      modal.setContent('');
      modal.setContent(container);

      let DockSide = false;
      let isElementSelect = false;
      let cssCodeValue;


      setEditorHeader(mainEditor);


      resetEditorsResize(monacoContainer, cssMonacoContainer, resizer);


      document.querySelector('.gjs-mdl-btn-close')
        .addEventListener('click', () => container.remove());


      require.config({
        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }
      });


      mainEditor.on('block:drag:stop', () => updateEditor(mainEditor));
      mainEditor.on('run:core:undo', () => updateEditor(mainEditor));
      mainEditor.on('run:core:redo', () => updateEditor(mainEditor));
      mainEditor.on('run:core:canvas-clear', () => updateEditor(mainEditor));


      const formatString = input =>
        input
          .replace(/{/g, '{\n\t')
          .replace(/;/g, ';\n\t')
          .replace(/\t}/g, '}')
          .replace(/}/g, '}\n');


      require(['vs/editor/editor.main'], () => {
        initMonacoEditors(mainEditor, monacoContainer, cssMonacoContainer, formatString);


        setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        setTimeout(() => {
          window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
          window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
        }, 10);
        setTimeout(() => {
          window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
          const formattedCode = window.monacoEditor.getValue();
          window.monacoEditor.setValue(formattedCode);
        }, 20);


        setupResizer(container, monacoContainer, cssMonacoContainer, resizer, DockSide);


        // document.querySelector('.fa-align-left').addEventListener('click', () => {
        // setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        // setTimeout(() => window.cssMonacoContainer.setValue(formatString(mainEditor.getCss())), 1);
        // });


        document.querySelector("#editorDockSide")
          .addEventListener('click', () => {
            DockSide = !DockSide;
            monacoContainer.style.width = '';
            monacoContainer.style.height = '';
            cssMonacoContainer.style.width = '';
            cssMonacoContainer.style.height = '';
            resizer.style.top = '';
            resizer.style.right = '';
            if (DockSide) {
              document.querySelector("#editorDockSide").style.rotate = "-90deg";
              document.querySelector(".gjs-mdl-container")
                .classList.add("vertical-gjs-mdl-dialog");
            } else {
              document.querySelector("#editorDockSide").style.rotate = "0deg";
              document.querySelector(".gjs-mdl-container")
                .classList.remove("vertical-gjs-mdl-dialog");
            }
            setupResizer(container, monacoContainer, cssMonacoContainer, resizer, DockSide);
          });
      });


      document.querySelector("#selectElementBtn")
        .addEventListener('click', () => {
          isElementSelect = !isElementSelect;
          const button = document.querySelector("#selectElementBtn");
          button.setAttribute('fill', isElementSelect ? '#FA8B8B' : '#FFFFFF');

          if (isElementSelect) {
            mainEditor.on('component:selected', model => {
              try {
                const fullHtml = mainEditor.getHtml();
                const selectedHtml = model.toHTML();
                if (window.monacoEditor.getValue() !== fullHtml) {
                  window.monacoEditor.setValue(fullHtml);
                }
                const startIndex = fullHtml.indexOf(selectedHtml);
                if (startIndex === -1) throw new Error('Selected HTML not found in full document.');
                const endIndex = startIndex + selectedHtml.length;
                const startPosition = window.monacoEditor.getModel().getPositionAt(startIndex);
                const endPosition = window.monacoEditor.getModel().getPositionAt(endIndex);
                window.monacoEditor.setSelection({
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                });
                window.monacoEditor.revealRangeInCenter({
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                });
              } catch (error) {
                console.error(error.message);
                alert('An error occurred: ' + error.message);
              }
              setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
            });
          }
        });

      function updateEditor(mainEditor) {
        setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        window.monacoEditor.setValue(mainEditor.getHtml());
        setTimeout(() => { cssCodeValue = mainEditor.getCss(); }, 1);
      }

      modal.open();
    },
  });

}


function createElement() {
  const monacoContainer = document.createElement('div');
  monacoContainer.id = 'editor';
  return monacoContainer;
}



function setupCodeEditorCommand(editor, modal, container, monacoContainer, resizer, cssMonacoContainer) {

  editor.Commands.add('code-editor', {
    run: (mainEditor, sender) => {
      let cssCode = mainEditor.getCss();
      mainEditor.setStyle(cssCode);
      modal.setContent('');
      modal.setContent(container);

      let DockSide = false;
      let isElementSelect = false;
      let cssCodeValue;


      setEditorHeader(mainEditor);


      resetEditorsResize(monacoContainer, cssMonacoContainer, resizer);


      document.querySelector('.gjs-mdl-btn-close')
        .addEventListener('click', () => container.remove());


      require.config({
        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }
      });


      mainEditor.on('block:drag:stop', () => updateEditor(mainEditor));
      mainEditor.on('run:core:undo', () => updateEditor(mainEditor));
      mainEditor.on('run:core:redo', () => updateEditor(mainEditor));
      mainEditor.on('run:core:canvas-clear', () => updateEditor(mainEditor));


      const formatString = input =>
        input
          .replace(/{/g, '{\n\t')
          .replace(/;/g, ';\n\t')
          .replace(/\t}/g, '}')
          .replace(/}/g, '}\n');


      require(['vs/editor/editor.main'], () => {
        initMonacoEditors(mainEditor, monacoContainer, cssMonacoContainer, formatString);


        setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        setTimeout(() => {
          window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
          window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
        }, 10);
        setTimeout(() => {
          window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
          const formattedCode = window.monacoEditor.getValue();
          window.monacoEditor.setValue(formattedCode);
        }, 20);


        setupResizer(container, monacoContainer, cssMonacoContainer, resizer, DockSide);


        // document.querySelector('#cleanCode').addEventListener('click', () => {
        //   setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        //   setTimeout(() => window.cssMonacoContainer.setValue(formatString(mainEditor.getCss())), 1);
        // });


        document.querySelector("#editorDockSide")
          .addEventListener('click', () => {
            DockSide = !DockSide;
            monacoContainer.style.width = '';
            monacoContainer.style.height = '';
            cssMonacoContainer.style.width = '';
            cssMonacoContainer.style.height = '';
            resizer.style.top = '';
            resizer.style.right = '';
            if (DockSide) {
              document.querySelector("#editorDockSide").style.rotate = "-90deg";
              document.querySelector(".gjs-mdl-container")
                .classList.add("vertical-gjs-mdl-dialog");
            } else {
              document.querySelector("#editorDockSide").style.rotate = "0deg";
              document.querySelector(".gjs-mdl-container")
                .classList.remove("vertical-gjs-mdl-dialog");
            }
            setupResizer(container, monacoContainer, cssMonacoContainer, resizer, DockSide);
          });
      });


      document.querySelector("#selectElementBtn")
        .addEventListener('click', () => {
          isElementSelect = !isElementSelect;
          const button = document.querySelector("#selectElementBtn");
          button.setAttribute('fill', isElementSelect ? '#FA8B8B' : '#FFFFFF');

          if (isElementSelect) {
            mainEditor.on('component:selected', model => {
              try {
                const fullHtml = mainEditor.getHtml();
                const selectedHtml = model.toHTML();
                if (window.monacoEditor.getValue() !== fullHtml) {
                  window.monacoEditor.setValue(fullHtml);
                }
                const startIndex = fullHtml.indexOf(selectedHtml);
                if (startIndex === -1) throw new Error('Selected HTML not found in full document.');
                const endIndex = startIndex + selectedHtml.length;
                const startPosition = window.monacoEditor.getModel().getPositionAt(startIndex);
                const endPosition = window.monacoEditor.getModel().getPositionAt(endIndex);
                window.monacoEditor.setSelection({
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                });
                window.monacoEditor.revealRangeInCenter({
                  startLineNumber: startPosition.lineNumber,
                  startColumn: startPosition.column,
                  endLineNumber: endPosition.lineNumber,
                  endColumn: endPosition.column,
                });
              } catch (error) {
                console.error(error.message);
                alert('An error occurred: ' + error.message);
              }
              setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
            });
          }
        });

      function updateEditor(mainEditor) {
        setTimeout(() => window.monacoEditor.getAction('editor.action.formatDocument').run(), 1);
        window.monacoEditor.setValue(mainEditor.getHtml());
        setTimeout(() => { cssCodeValue = mainEditor.getCss(); }, 1);
      }

      modal.open();
    },
  });
}

function setEditorHeader(mainEditor) {
  const editorHead = document.createElement('div');
  editorHead.innerHTML = `
<p>Code Editor</p>
<div class="editor-header">
<div>
<i id="cleanCode" class="fa-solid fa-align-left" style="color:#fff" title="clean code"></i>
<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" data-name="Layer 1" viewBox="0 0 100 125" id="editorDockSide" width="32px" height="32px">
<path d="M82,68V32A12,12,0,0,0,70,20H46A12,12,0,0,0,34,32V68A12,12,0,0,0,46,80H70A12,12,0,0,0,82,68ZM42,68V32a4,4,0,0,1,4-4H70a4,4,0,0,1,4,4V68a4,4,0,0,1-4,4H46A4,4,0,0,1,42,68Z"/>
<path d="M22,76a4,4,0,0,0,4-4V28a4,4,0,0,0-8,0V72A4,4,0,0,0,22,76Z"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" id="selectElementBtn" width="32px" height="32px" viewBox="0 0 24 24">
<path d="M18.2848192,17.5777124 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L17.5777124,18.2848192 L15.9160251,20.7773501 C15.6899572,21.116452 15.1749357,21.0571624 15.0318354,20.6755617 L12.0318354,12.6755617 C11.8811067,12.2736185 12.2736185,11.8811067 12.6755617,12.0318354 L20.6755617,15.0318354 C21.0571624,15.1749357 21.116452,15.6899572 20.7773501,15.9160251 L18.2848192,17.5777124 Z M17.2312404,17.0782479 L19.4104716,15.6254271 L13.3544004,13.3544004 L15.6254271,19.4104716 L17.0782479,17.2312404 C17.0974475,17.2011742 17.1201804,17.1727128 17.1464466,17.1464466 C17.1727128,17.1201804 17.2011742,17.0974475 17.2312404,17.0782479 Z M5.5,3 C5.77614237,3 6,3.22385763 6,3.5 C6,3.77614237 5.77614237,4 5.5,4 C4.67157288,4 4,4.67157288 4,5.5 C4,5.77614237 3.77614237,6 3.5,6 C3.22385763,6 3,5.77614237 3,5.5 C3,4.11928813 4.11928813,3 5.5,3 Z M8.5,4 C8.22385763,4 8,3.77614237 8,3.5 C8,3.22385763 8.22385763,3 8.5,3 L10.5,3 C10.7761424,3 11,3.22385763 11,3.5 C11,3.77614237 10.7761424,4 10.5,4 L8.5,4 Z M13.5,4 C13.2238576,4 13,3.77614237 13,3.5 C13,3.22385763 13.2238576,3 13.5,3 L15.5,3 C15.7761424,3 16,3.22385763 16,3.5 C16,3.77614237 15.7761424,4 15.5,4 L13.5,4 Z M8.5,21 C8.22385763,21 8,20.7761424 8,20.5 C8,20.2238576 8.22385763,20 8.5,20 L10.5,20 C10.7761424,20 11,20.2238576 11,20.5 C11,20.7761424 10.7761424,21 10.5,21 L8.5,21 Z M3,8.5 C3,8.22385763 3.22385763,8 3.5,8 C3.77614237,8 4,8.22385763 4,8.5 L4,10.5 C4,10.7761424 3.77614237,11 3.5,11 C3.22385763,11 3,10.7761424 3,10.5 L3,8.5 Z M3,13.5 C3,13.2238576 3.22385763,13 3.5,13 C3.77614237,13 4,13.2238576 4,13.5 L4,15.5 C4,15.7761424 3.77614237,16 3.5,16 C3.22385763,16 3,15.7761424 3,15.5 L3,13.5 Z M3,18.5 C3,18.2238576 3.22385763,18 3.5,18 C3.77614237,18 4,18.2238576 4,18.5 C4,19.3284271 4.67157288,20 5.5,20 C5.77614237,20 6,20.2238576 6,20.5 C6,20.7761424 5.77614237,21 5.5,21 C4.11928813,21 3,19.8807119 3,18.5 Z M21,10.5 C21,10.7761424 20.7761424,11 20.5,11 C20.2238576,11 20,10.7761424 20,10.5 L20,8.5 C20,8.22385763 20.2238576,8 20.5,8 C20.7761424,8 21,8.22385763 21,8.5 L21,10.5 Z M21,5.5 C21,5.77614237 20.7761424,6 20.5,6 C20.2238576,6 20,5.77614237 20,5.5 C20,4.67157288 19.3284271,4 18.5,4 C18.2238576,4 18,3.77614237 18,3.5 C18,3.22385763 18.2238576,3 18.5,3 C19.8807119,3 21,4.11928813 21,5.5 Z"/>
`;
  mainEditor.Modal.setTitle(editorHead);
}

function resetEditorsResize(monacoContainer, cssMonacoContainer, resizer) {
  monacoContainer.style.width = '';
  monacoContainer.style.height = '';
  cssMonacoContainer.style.height = '';
  resizer.style.top = '';
  resizer.style.right = '';
}

function initMonacoEditors(mainEditor, monacoContainer, cssMonacoContainer, formatString) {
  if (!window.monacoEditor) {
    window.monacoEditor = monaco.editor.create(monacoContainer, {
      value: mainEditor.getHtml(),
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      wordWrap: "on",
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

function setupEditorResizer(container, monacoContainer, cssMonacoContainer, resizer, side) {
  let isResizing = false;
  let handleMouseMove, handleMouseUp;

  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);

  const resizerCursor = side ? 'row-resize' : 'col-resize';

  if (side) {
    handleMouseMove = e => {
      if (!isResizing) return;
      const containerRect = container.getBoundingClientRect();
      const newTopHeightPx = e.clientY - containerRect.top;
      const newTopHeightPercent = (newTopHeightPx / containerRect.height) * 100;
      const newBottomHeightPercent = 100 - newTopHeightPercent;
      if (newTopHeightPercent < 10 || newBottomHeightPercent < 10) return;
      monacoContainer.style.height = `${newTopHeightPercent}%`;
      cssMonacoContainer.style.height = `${newBottomHeightPercent}%`;
      resizer.style.top = `${newTopHeightPercent}%`;
    };
    handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
      }
    };
  } else {
    handleMouseMove = e => {
      if (!isResizing) return;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidthPx = e.clientX - containerRect.left;
      const newLeftWidthPercent = (newLeftWidthPx / containerRect.width) * 100;
      const newRightWidthPercent = 100 - newLeftWidthPercent;
      if (newLeftWidthPercent < 10 || newRightWidthPercent < 10) return;
      monacoContainer.style.width = `${newLeftWidthPercent}%`;
      cssMonacoContainer.style.width = `${newRightWidthPercent}%`;
      resizer.style.right = `${newRightWidthPercent}%`;
    };
    handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
      }
    };
  }

  resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = resizerCursor;
  });
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

export { setupCodeEditorCommand };