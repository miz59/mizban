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
  
  // Setup iframe events
  setupIframeEvents();
  
  require(['vs/editor/editor.main'], () => {
    setTimeout(() => {
      clearContainers(htmlContainer, cssContainer);
      initMonacoEditors(mainEditor, htmlContainer, cssContainer);
      setupEditorsLayout();
      setupDefaultContent();
      formatEditors();
      
      // Debug iframe content after initialization
      setTimeout(() => {
        debugIframeContent();
      }, 1000);
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

// ===== HELPER FUNCTIONS =====
function extractIdFromLine(lineContent) {
  // Look for id attribute in the line
  const idMatch = lineContent.match(/id=["']([^"']+)["']/);
  if (idMatch) {
    return idMatch[1];
  }
  return null;
}

function findElementIdInRange(monacoEditor, startLine, endLine) {
  for (let line = startLine; line <= endLine; line++) {
    const lineContent = monacoEditor.getModel().getLineContent(line);
    const id = extractIdFromLine(lineContent);
    if (id) {
      return id;
    }
  }
  return null;
}

// ===== HTML CLICK HANDLER =====
function handleHtmlEditorClick(event, monacoEditor, mainEditor) {
  const position = event.target.position;
  if (!position) return;
  
  const lineNumber = position.lineNumber;
  const column = position.column;
  const lineContent = monacoEditor.getModel().getLineContent(lineNumber);
  
  console.log(`Clicked on line ${lineNumber}, column ${column}:`, lineContent);
  
  // First, try to extract ID from the current line
  let elementId = extractIdFromLine(lineContent);
  
  // If no ID found on current line, check if we're inside a multi-line element
  if (!elementId) {
    // Look for opening tag on current line
    const openingTagMatch = lineContent.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?$/);
    if (openingTagMatch) {
      const tagName = openingTagMatch[1];
      // Check if this tag has an ID in the same line
      elementId = extractIdFromLine(lineContent);
      
      // If still no ID, look for closing tag and check if it's a self-closing or multi-line element
      const closingTagMatch = lineContent.match(/\/>/);
      if (!closingTagMatch) {
        // This might be a multi-line element, search for ID in nearby lines
        const searchRange = 5; // Search 5 lines up and down
        const startLine = Math.max(1, lineNumber - searchRange);
        const endLine = Math.min(monacoEditor.getModel().getLineCount(), lineNumber + searchRange);
        elementId = findElementIdInRange(monacoEditor, startLine, endLine);
      }
    }
  }
  
  if (elementId) {
    console.log(`Found ID: ${elementId}`);
    selectComponentById(elementId, mainEditor);
    return;
  }
  
  // Fallback to tag-based selection
  const beforeCursor = lineContent.substring(0, column - 1);
  const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?$/);
  
  if (tagMatch) {
    const tagName = tagMatch[1];
    console.log(`Found tag: ${tagName}`);
    selectComponentByTag(tagName, mainEditor);
  }
}

// ===== COMPONENT SELECTION =====
function selectComponentById(elementId, mainEditor) {
  try {
    // Get iframe content
    const iframe = document.querySelector('.gjs-frame');
    if (!iframe) {
      console.warn('GrapesJS iframe not found');
      return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const bodyInIframe = iframeDoc.body;
    const wrapperInIframe = bodyInIframe.querySelector('[data-gjs-type="wrapper"]');
    
    if (!wrapperInIframe) {
      console.warn('Wrapper not found in iframe');
      return;
    }

    // Find element by ID in iframe
    const targetElement = wrapperInIframe.querySelector(`#${elementId}`);
    if (!targetElement) {
      console.warn(`Element with ID '${elementId}' not found in iframe`);
      return;
    }

    // Find corresponding component in GrapesJS
    const selectedComponent = mainEditor.getComponents().find(component => {
      const componentHtml = component.toHTML();
      return componentHtml.includes(`id="${elementId}"`) || 
             componentHtml.includes(`id='${elementId}'`);
    });

    if (selectedComponent) {
      // Select the component in GrapesJS
      mainEditor.select(selectedComponent);
      
      // Trigger click event on the iframe element to simulate user interaction
      targetElement.click();
      
      // Highlight the selected component
      highlightSelectedComponent(mainEditor);
      
      console.log(`Component with ID '${elementId}' selected successfully`);
    } else {
      console.warn(`Component with ID '${elementId}' not found in GrapesJS components`);
    }
  } catch (error) {
    console.error('Error selecting component by ID:', error);
  }
}

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
  try {
    // Highlight in iframe
    const iframe = document.querySelector('.gjs-frame');
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const bodyInIframe = iframeDoc.body;
      const wrapperInIframe = bodyInIframe.querySelector('[data-gjs-type="wrapper"]');
      
      if (wrapperInIframe) {
        // Add highlight to all elements temporarily
        const allElements = wrapperInIframe.querySelectorAll('*');
        allElements.forEach(el => {
          el.style.outline = '1px solid #0073aa';
          el.style.outlineOffset = '1px';
        });
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
          allElements.forEach(el => {
            el.style.outline = '';
            el.style.outlineOffset = '';
          });
        }, 2000);
      }
    }
    
    // Also highlight in GrapesJS canvas
    mainEditor.Canvas.getBody().style.outline = '2px solid #0073aa';
    setTimeout(() => {
      mainEditor.Canvas.getBody().style.outline = '';
    }, 2000);
  } catch (error) {
    console.error('Error highlighting component:', error);
  }
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

// ===== IFRAME CONTENT FUNCTIONS =====
export function getIframeContent() {
  const iframe = document.querySelector('.gjs-frame');
  if (!iframe) {
    console.warn('GrapesJS iframe not found');
    return null;
  }
  
  try {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    return iframeDocument;
  } catch (error) {
    console.error('Error accessing iframe content:', error);
    return null;
  }
}

export function getIframeContentAsString() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return '';
  
  try {
    return iframeDocument.documentElement.outerHTML;
  } catch (error) {
    console.error('Error getting iframe content as string:', error);
    return '';
  }
}

export function getIframeBodyContentAsString() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return '';
  
  try {
    const body = iframeDocument.body;
    return body ? body.innerHTML : '';
  } catch (error) {
    console.error('Error getting iframe body content:', error);
    return '';
  }
}

// ===== IFRAME EVENT SETUP =====
export function setupIframeEvents() {
  const iframe = document.querySelector('.gjs-frame');
  if (!iframe) {
    console.warn('GrapesJS iframe not found for event setup');
    return;
  }

  // Wait for iframe to load
  iframe.addEventListener('load', () => {
    console.log('GrapesJS iframe loaded');
    setupIframeContentEvents();
  });

  // Also try to setup immediately if iframe is already loaded
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    console.log('GrapesJS iframe already loaded');
    setupIframeContentEvents();
  }
}

function setupIframeContentEvents() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return;

  try {
    // Add event listeners to iframe document
    iframeDocument.addEventListener('DOMContentLoaded', () => {
      console.log('Iframe DOM content loaded');
    });

    iframeDocument.addEventListener('load', () => {
      console.log('Iframe content fully loaded');
    });

    // Monitor for changes in the iframe content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          console.log('Iframe content changed');
          // You can add your custom logic here
        }
      });
    });

    observer.observe(iframeDocument.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

  } catch (error) {
    console.error('Error setting up iframe events:', error);
  }
}

// ===== DEBUG FUNCTIONS =====
export function debugIframeContent() {
  const iframe = document.querySelector('.gjs-frame');

  if (!iframe) {
    console.log('GrapesJS iframe not found');
    return;
  }

  
  try {
    const iframe = document.querySelector('.gjs-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const bodyInIframe = iframeDoc.body;
    const wrapperInIframe = bodyInIframe.querySelector('[data-gjs-type="wrapper"]');

    console.log(wrapperInIframe.innerHTML);
  } catch (error) {
    console.error('Error accessing iframe content:', error);
  }
}