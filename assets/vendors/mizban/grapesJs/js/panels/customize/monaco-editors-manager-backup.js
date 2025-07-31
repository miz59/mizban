import { setupComponentNavigation } from '../functions/monaco-navigation-indicator.js';
import { formatHtmlCode, formatCssCode } from '../functions/monaco-clean-code.js';

// ===== MONACO EDITORS INITIALIZATION =====
export function initializeMonacoEditors(mainEditor, editorContainer) {
  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  
  if (!htmlContainer || !cssContainer) {
    console.error('Editor containers not found');
    return;
  }
  
  setupMonacoRequire();
  setupCleanCodeButton();
  
  require(['vs/editor/editor.main'], () => {
    setTimeout(() => {
      clearContainers(htmlContainer, cssContainer);
      initMonacoEditors(mainEditor, htmlContainer, cssContainer);
      setupEditorsLayout();
      setupDefaultContent();
      formatEditors();
    }, 100);
  });
}

// ===== MONACO REQUIRE CONFIG =====
function setupMonacoRequire() {
  require.config({
    paths: { 'vs': 'assets/vendors/mizban/playground' }
  });
}

// ===== CONTAINER CLEANUP =====
function clearContainers(htmlContainer, cssContainer) {
  htmlContainer.innerHTML = '';
  cssContainer.innerHTML = '';
}

// ===== MONACO EDITORS CREATION =====
function initMonacoEditors(mainEditor, htmlContainer, cssContainer) {
  const currentHtml = mainEditor.getHtml() || '<div>Hello World</div>';
  const currentCss = mainEditor.getCss() || ' ';
  
  disposeExistingEditors();
  
  // Create HTML editor
  window.monacoEditor = createHtmlEditor(htmlContainer, currentHtml);
  setupHtmlEditorEvents(window.monacoEditor, mainEditor);
  setupComponentNavigation(mainEditor);

  // Create CSS editor
  window.cssMonacoContainer = createCssEditor(cssContainer, formatCssString(currentCss));
  setupCssEditorEvents(window.cssMonacoContainer, mainEditor);
}

// ===== EDITOR CREATION HELPERS =====
function createHtmlEditor(container, value) {
  return monaco.editor.create(container, {
    value: value,
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
  });
}

function createCssEditor(container, value) {
  return monaco.editor.create(container, {
    value: value,
    language: 'css',
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
  });
}

// ===== EDITOR DISPOSAL =====
function disposeExistingEditors() {
  if (window.monacoEditor) {
    window.monacoEditor.dispose();
    window.monacoEditor = null;
  }
  if (window.cssMonacoContainer) {
    window.cssMonacoContainer.dispose();
    window.cssMonacoContainer = null;
  }
}

// ===== CSS FORMATTING =====
function formatCssString(input) {
  return input
    .replace(/{/g, '{\n\t')
    .replace(/;/g, ';\n\t')
    .replace(/\t}/g, '}')
    .replace(/}/g, '}\n');
}

// ===== EDITORS LAYOUT =====
function setupEditorsLayout() {
  if (window.monacoEditor) window.monacoEditor.layout();
  if (window.cssMonacoContainer) window.cssMonacoContainer.layout();
}

// ===== DEFAULT CONTENT =====
function setupDefaultContent() {
  if (window.monacoEditor && !window.monacoEditor.getValue().trim()) {
    window.monacoEditor.setValue(' ');
  }
  if (window.cssMonacoContainer && !window.cssMonacoContainer.getValue().trim()) {
    window.cssMonacoContainer.setValue(' ');
  }
}

// ===== FORMAT EDITORS =====
function formatEditors() {
  setTimeout(() => {
    if (window.monacoEditor) {
      window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
    }
    if (window.cssMonacoContainer) {
      window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
    }
  }, 50);
}

// ===== HTML EDITOR EVENTS =====
function setupHtmlEditorEvents(monacoEditor, mainEditor) {
  monacoEditor.onDidChangeModelContent(() => {
    const code = monacoEditor.getValue();
    try {
      mainEditor.DomComponents.getWrapper().set('content', '');
      mainEditor.setComponents(code.trim());
      mainEditor.store();
    } catch (error) {
      console.error('Error updating HTML:', error);
    }
  });
  
  monacoEditor.onMouseDown(event => {
    handleHtmlEditorClick(event, monacoEditor, mainEditor);
  });
}

// ===== HTML CLICK HANDLER =====
function handleHtmlEditorClick(event, monacoEditor, mainEditor) {
  const position = event.target.position;
  if (!position) return;
  
  const lineNumber = position.lineNumber;
  const column = position.column;
  const lineContent = monacoEditor.getModel().getLineContent(lineNumber);
  
  const beforeCursor = lineContent.substring(0, column - 1);
  const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?$/);
  
  if (tagMatch) {
    const tagName = tagMatch[1];
    selectComponentByTag(tagName, mainEditor);
  }
}

// ===== COMPONENT SELECTION =====
function selectComponentByTag(tagName, mainEditor) {
  const selectedComponent = mainEditor.getComponents().find(component => {
    const componentHtml = component.toHTML();
    return componentHtml.trim().startsWith(`<${tagName}`) || 
          componentHtml.includes(`<${tagName} `) ||
          componentHtml.includes(`<${tagName}>`);
  });
  
  if (selectedComponent) {
    mainEditor.select(selectedComponent);
    highlightSelectedComponent(mainEditor);
  }
}

// ===== COMPONENT HIGHLIGHT =====
function highlightSelectedComponent(mainEditor) {
  mainEditor.Canvas.getBody().style.outline = '2px solid #0073aa';
  setTimeout(() => {
    mainEditor.Canvas.getBody().style.outline = '';
  }, 2000);
}

// ===== CSS EDITOR EVENTS =====
function setupCssEditorEvents(cssMonacoContainer, mainEditor) {
  // Use onDidChangeModelContent for real-time updates
  cssMonacoContainer.onDidChangeModelContent(() => {
    const cssCodeValue = cssMonacoContainer.getValue();
    try {
      mainEditor.setStyle(cssCodeValue);
      mainEditor.store();
    } catch (error) {
      console.error('Error updating CSS:', error);
    }
  });
}

// ===== CLEAN CODE BUTTON =====
function setupCleanCodeButton() {
  document.querySelector('#cleanCode')?.addEventListener('click', () => {
    if (window.monacoEditor) {
      const htmlCode = window.monacoEditor.getValue();
      const formattedHtml = formatHtmlCode(htmlCode);
      window.monacoEditor.setValue(formattedHtml);
    }
    
    if (window.cssMonacoContainer) {
      const cssCode = window.cssMonacoContainer.getValue();
      const formattedCss = formatCssCode(cssCode);
      window.cssMonacoContainer.setValue(formattedCss);
    }
  });
} 