// import setupResizer from './panel-resizer.js';
import { formatHtmlCode, formatCssCode } from '../functions/clean-code.js';
import { setupComponentNavigation } from '../functions/navigation-indicator.js';
import { updateEditorWithFormat } from '../functions/editor-updater.js';

function setupCodeEditorCommand(editor, modal, container, monacoContainer, resizer, cssMonacoContainer) {

  editor.Commands.add('code-editor', {
    run: (mainEditor, sender) => {
      let cssCode = mainEditor.getCss();
      mainEditor.setStyle(cssCode);
      
      let DockSide = false;
      let isElementSelect = false;
      let cssCodeValue;

      setupDraggableModal(modal);
      
      const wrapperContent = window.monacoDraggableContent;
      
      const editorContainer = document.createElement('div');
      editorContainer.className = 'monaco-editor-container';
      
      const htmlContainer = document.createElement('div');
      htmlContainer.id = 'htmlEditor';
      htmlContainer.className = 'html-editor';
      
      const cssContainer = document.createElement('div');
      cssContainer.id = 'cssEditor';
      cssContainer.className = 'css-editor';
      
      editorContainer.appendChild(htmlContainer);
      editorContainer.appendChild(cssContainer);
      
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'monaco-resize-handle';
      
      editorContainer.appendChild(resizeHandle);
      
      let isResizing = false;
      let startX, startLeftPercent;

      function startResizing(e) {
        isResizing = true;
        startX = e.clientX;
        startLeftPercent = parseFloat(htmlContainer.style.width) || 50;
        
        editorContainer.style.width = editorContainer.offsetWidth + 'px';
        
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
        e.stopPropagation();
      }

      function stopResizing() {
        if (!isResizing) return;
        
        isResizing = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
        
        editorContainer.style.width = '';
        
        if (window.monacoEditor) {
          window.monacoEditor.layout();
        }
        if (window.cssMonacoContainer) {
          window.cssMonacoContainer.layout();
        }
      }

      function resize(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const containerWidth = editorContainer.offsetWidth;
        const deltaPercent = (deltaX / containerWidth) * 100;
        
        let newLeftPercent = startLeftPercent + deltaPercent;
        
        newLeftPercent = Math.max(20, Math.min(80, newLeftPercent));
        const rightPercent = 100 - newLeftPercent;
        
        requestAnimationFrame(() => {
          htmlContainer.style.width = newLeftPercent + '%';
          cssContainer.style.width = rightPercent + '%';
        });
        
        requestAnimationFrame(() => {
          resizeHandle.style.left = newLeftPercent + '%';
        });
        
        if (window.monacoEditor) {
          window.monacoEditor.layout();
        }
        if (window.cssMonacoContainer) {
          window.cssMonacoContainer.layout();
        }
        
        e.preventDefault();
        e.stopPropagation();
      }

      resizeHandle.addEventListener('mousedown', startResizing);
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResizing);
      
      wrapperContent.appendChild(editorContainer);

      setEditorHeader(mainEditor);

      resetEditorsResize(htmlContainer, cssContainer);
      
      require.config({
        paths: { 'vs': 'assets/vendors/mizban/playground' }
      });

      const formatString = input =>
        input
          .replace(/{/g, '{\n\t')
          .replace(/;/g, ';\n\t')
          .replace(/\t}/g, '}')
          .replace(/}/g, '}\n');

      require(['vs/editor/editor.main'], () => {
        // Ensure Monaco is fully loaded before initializing editors
        setTimeout(() => {
          // Clear containers before creating new editors
          htmlContainer.innerHTML = '';
          cssContainer.innerHTML = '';
          
          initMonacoEditors(mainEditor, htmlContainer, cssContainer, formatString);
          
          // Ensure content is properly loaded
          if (window.monacoEditor && window.cssMonacoContainer) {
            // Force layout update
            window.monacoEditor.layout();
            window.cssMonacoContainer.layout();
            
            // Ensure editors have content
            if (!window.monacoEditor.getValue().trim()) {
              window.monacoEditor.setValue('<div>Hello World</div>');
            }
            if (!window.cssMonacoContainer.getValue().trim()) {
              window.cssMonacoContainer.setValue('body { margin: 0; padding: 20px; }');
            }
            
            // Format the code after a short delay
            setTimeout(() => {
              if (window.monacoEditor) {
                window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
              }
              if (window.cssMonacoContainer) {
                window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
              }
            }, 50);
          }
        }, 100);

        // setupResizer(editorContainer, htmlContainer, cssContainer, DockSide);

        document.querySelector('#cleanCode').addEventListener('click', () => {
          const htmlCode = window.monacoEditor.getValue();
          const formattedHtml = formatHtmlCode(htmlCode);
          window.monacoEditor.setValue(formattedHtml);
          
          const cssCode = window.cssMonacoContainer.getValue();
          const formattedCss = formatCssCode(cssCode);
          window.cssMonacoContainer.setValue(formattedCss);

          console.log('cleanCode');
        });
      });
    },
  });
}

function setupDraggableModal(modal) { 
  function createDraggableWrapper() {
    const existingWrapper = document.querySelector('.monaco-draggable-wrapper');
    if (existingWrapper) {
      // Dispose existing Monaco editors before removing wrapper
      if (window.monacoEditor) {
        window.monacoEditor.dispose();
        window.monacoEditor = null;
      }
      if (window.cssMonacoContainer) {
        window.cssMonacoContainer.dispose();
        window.cssMonacoContainer = null;
      }
      existingWrapper.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'monaco-draggable-wrapper';
    
    const header = document.createElement('div');
    header.className = 'monaco-header';
    header.innerHTML = `
      <div class="d-flex align-items-center gap-1">
        <span class="on-primary-color font-weight-bold font-primary">Code Editor</span>
        <i id="cleanCode" class="fa-solid fa-align-left on-primary-color cursor-pointer p-1 radius-all-small" title="Clean Code"></i>
      </div>
      <div class="monaco-close-btn">
        <i id="monacoCloseBtn" class="fa-solid fa-close on-primary-color txt-subtitle"></i>
    `;
    
    const content = document.createElement('div');
    content.className = 'monaco-content';
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    
    document.body.appendChild(wrapper);
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    function startDragging(e) {
      if (e.target.closest('#cleanCode') ||
          e.target.closest('#monacoCloseBtn')) {
        return;
      }
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = wrapper.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      
      wrapper.classList.add('dragging');
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
      
      e.preventDefault();
    }

    function stopDragging() {
      if (!isDragging) return;
      
      isDragging = false;
      wrapper.classList.remove('dragging');
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
    }

    function drag(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      
      const maxX = window.innerWidth - wrapper.offsetWidth;
      const maxY = window.innerHeight - wrapper.offsetHeight;
      
      const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
      const boundedTop = Math.max(0, Math.min(newTop, maxY));
      
      wrapper.style.left = boundedLeft + 'px';
      wrapper.style.top = boundedTop + 'px';
      wrapper.style.transform = 'none';
      
      e.preventDefault();
    }

    header.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    header.addEventListener('selectstart', (e) => e.preventDefault());
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDragging) {
        stopDragging();
      }
    });

    document.getElementById('monacoCloseBtn').addEventListener('click', () => {
      wrapper.remove();
    });

    return { wrapper, content };
  }

  const { wrapper, content } = createDraggableWrapper();
  
  window.monacoDraggableWrapper = wrapper;
  window.monacoDraggableContent = content;
}

function setEditorHeader(mainEditor) {
}

function resetEditorsResize(htmlContainer, cssContainer) {
  htmlContainer.style.width = '50%';
  cssContainer.style.width = '50%';
  
}

function initMonacoEditors(mainEditor, monacoContainer, cssMonacoContainer, formatString) {
  // Get current content from editor
  const currentHtml = mainEditor.getHtml() || '<div>Hello World</div>';
  const currentCss = mainEditor.getCss() || 'body { margin: 0; padding: 20px; }';
  
  // Dispose existing editors if they exist
  if (window.monacoEditor) {
    window.monacoEditor.dispose();
    window.monacoEditor = null;
  }
  if (window.cssMonacoContainer) {
    window.cssMonacoContainer.dispose();
    window.cssMonacoContainer = null;
  }
  
  // Create new HTML editor
  window.monacoEditor = monaco.editor.create(monacoContainer, {
    value: currentHtml,
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
        const column = position.column;
        const lineContent = window.monacoEditor.getModel().getLineContent(lineNumber);
        
        // console.log('Clicked at line:', lineNumber, 'column:', column);
        // console.log('Line content:', lineContent);
        
      
        const beforeCursor = lineContent.substring(0, column - 1);
        const afterCursor = lineContent.substring(column - 1);
        
      
        const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?$/);
        if (tagMatch) {
          const tagName = tagMatch[1];
          console.log('Found tag:', tagName);
          
        
          const allComponents = mainEditor.getComponents();
          console.log('All components:', allComponents.length);
          
        
          const selectedComponent = allComponents.find(component => {
            const componentHtml = component.toHTML();
            console.log('Component HTML:', componentHtml);
          
            return componentHtml.trim().startsWith(`<${tagName}`) || 
                  componentHtml.includes(`<${tagName} `) ||
                  componentHtml.includes(`<${tagName}>`);
          });
          
          if (selectedComponent) {
            console.log('Selected component:', selectedComponent);
            mainEditor.select(selectedComponent);
          
            mainEditor.Canvas.getBody().style.outline = '2px solid #0073aa';
            setTimeout(() => {
              mainEditor.Canvas.getBody().style.outline = '';
            }, 2000);
          } else {
            console.log('No component found for tag:', tagName);
          }
        } else {
          // console.log('No tag found at cursor position');
        }
      }
    });
  

  setupComponentNavigation(mainEditor);

  // Create new CSS editor
  window.cssMonacoContainer = monaco.editor.create(cssMonacoContainer, {
    value: formatString(currentCss),
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
    
  
    // window.cssMonacoContainer.onMouseDown(event => {
    //   const position = event.target.position;
    //   if (position) {
    //     const lineNumber = position.lineNumber;
    //     const column = position.column;
    //     const lineContent = window.cssMonacoContainer.getModel().getLineContent(lineNumber);
        
      
    //     const beforeCursor = lineContent.substring(0, column - 1);
    //     const selectorMatch = beforeCursor.match(/([a-zA-Z][a-zA-Z0-9\-_]*)(?:\s*{)?$/);
        
    //     if (selectorMatch) {
    //       const selector = selectorMatch[1];
          
        
    //       const selectedComponent = mainEditor.getComponents().find(component => {
    //         const componentEl = component.getEl();
    //         if (componentEl) {
            
    //           return componentEl.matches(selector) || 
    //                 componentEl.id === selector ||
    //                 componentEl.className.includes(selector);
    //         }
    //         return false;
    //       });
          
    //       if (selectedComponent) {
    //         mainEditor.select(selectedComponent);
          
    //         mainEditor.Canvas.getBody().style.outline = '2px solid #0073aa';
    //         setTimeout(() => {
    //           mainEditor.Canvas.getBody().style.outline = '';
    //         }, 2000);
    //       }
    //     }
    //   }
    // });

}

function showHtmlOnlyEditor() {
    const mainEditor = window.editor;
    if (!mainEditor) {
        console.error('GrapesJS editor not found');
        return;
    }
    const modal = mainEditor.Modal;
    modal.setTitle('HTML Editor');
    
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 500px;';
    
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px; padding: 10px; background: #2d2d2d; border-radius: 4px;';
    
    const cleanCodeBtn = document.createElement('i');
    cleanCodeBtn.className = 'fa-solid fa-align-left';
    cleanCodeBtn.style.cssText = 'color: #fff; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.3s;';
    cleanCodeBtn.title = 'Clean HTML Code';
    
    header.appendChild(cleanCodeBtn);
    container.appendChild(header);
    
    const htmlContainer = document.createElement('div');
    htmlContainer.id = 'htmlOnlyEditor';
    htmlContainer.style.cssText = 'width: 100%; height: calc(100% - 60px);';
    
    container.appendChild(htmlContainer);
    modal.setContent(container);
    
    require.config({
        paths: { 'vs': 'assets/vendors/mizban/playground' }
    });
    
    require(['vs/editor/editor.main'], () => {
        const htmlEditor = monaco.editor.create(htmlContainer, {
            value: formatHtmlCode(mainEditor.getHtml()),
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            wordWrap: "on",
        });
        
      
        htmlEditor.onDidChangeModelContent(() => {
            const htmlCode = htmlEditor.getValue();
            mainEditor.DomComponents.getWrapper().set('content', '');
            mainEditor.setComponents(htmlCode.trim());
        });
        
        cleanCodeBtn.addEventListener('click', () => {
            const htmlCode = htmlEditor.getValue();
            const formattedHtml = formatHtmlCode(htmlCode);
            htmlEditor.setValue(formattedHtml);
        });
        
        window.htmlOnlyEditor = htmlEditor;
        
        modal.open();
    });

    
}

function showCssOnlyEditor() {
    const mainEditor = window.editor;
    if (!mainEditor) {
        console.error('GrapesJS editor not found');
        return;
    }
    const modal = mainEditor.Modal;
    modal.setTitle('CSS Editor');
    
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 500px;';
    
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px; padding: 10px; background: #2d2d2d; border-radius: 4px;';
    
    // const cleanCodeBtn = document.createElement('i');
    // cleanCodeBtn.className = 'fa-solid fa-align-left';
    // cleanCodeBtn.style.cssText = 'color: #fff; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.3s;';
    // cleanCodeBtn.title = 'Clean CSS Code';
    // cleanCodeBtn.onmouseover = () => cleanCodeBtn.style.background = '#444';
    // cleanCodeBtn.onmouseout = () => cleanCodeBtn.style.background = 'transparent';
    
    header.appendChild(cleanCodeBtn);
    container.appendChild(header);
    
    // const cssContainer = document.createElement('div');
    // cssContainer.id = 'cssOnlyEditor';
    // cssContainer.style.cssText = 'width: 100%; height: calc(100% - 60px);';
    
    container.appendChild(cssContainer);
    modal.setContent(container);
    
    require.config({
        paths: { 'vs': 'assets/vendors/mizban/playground' }
    });
    
    require(['vs/editor/editor.main'], () => {
        const cssEditor = monaco.editor.create(cssContainer, {
            value: formatCssCode(mainEditor.getCss()),
            language: 'css',
            theme: 'vs-dark',
            automaticLayout: true,
            wordWrap: "on",
        });
        
      
        cssEditor.onDidChangeModelContent(() => {
            const cssCode = cssEditor.getValue();
            mainEditor.setStyle(cssCode);
        });
        
        cleanCodeBtn.addEventListener('click', () => {
            const cssCode = cssEditor.getValue();
            const formattedCss = formatCssCode(cssCode);
            cssEditor.setValue(formattedCss);
        });
        
        window.cssOnlyEditor = cssEditor;
        
        modal.open();
    });
}

window.showHtmlOnlyEditor = showHtmlOnlyEditor;
window.showCssOnlyEditor = showCssOnlyEditor;
export { setupCodeEditorCommand };