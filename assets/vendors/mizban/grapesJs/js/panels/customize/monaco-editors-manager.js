import { setupComponentNavigation } from '../functions/monaco-navigation-indicator.js';
import { formatHtmlCode, formatCssCode } from '../functions/monaco-clean-code.js';

// ===== MONACO EDITORS INITIALIZATION =====
export function initializeMonacoEditors(mainEditor, editorContainer) {
  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  
  if (!htmlContainer || !cssContainer) {
    return;
  }
  
  setupMonacoRequire();
  setupCleanCodeButton();
  
  // Setup iframe events
  setupIframeEvents();
  
  require(['vs/editor/editor.main'], () => {
    // Wait for Monaco to be fully initialized
    const initMonaco = () => {
      if (window.monaco && window.monaco.editor) {
        clearContainers(htmlContainer, cssContainer);
        initMonacoEditors(mainEditor, htmlContainer, cssContainer);
        setupEditorsLayout();
        setupDefaultContent();
        formatEditors();
        

      } else {
        setTimeout(initMonaco, 200);
      }
    };
    
    // Start initialization
    setTimeout(initMonaco, 100);
  });
}

// ===== MONACO REQUIRE CONFIG =====
function setupMonacoRequire() {
  require.config({
    // paths: { 'vs': 'assets/vendors/mizban/playground' }
    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }
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
  
  // Store mainEditor globally for access in other functions
  window.mainEditor = mainEditor;
  
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
    // Disable navigation indicator to prevent unwanted line highlighting
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    // Improve click handling
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 1,
    // Disable unwanted features
    renderWhitespace: 'none',
    renderLineHighlight: 'none'
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
    fontSize: 14
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
      // Error updating HTML
    }
  });
  
  // Use onMouseDown for more precise click handling
  monacoEditor.onMouseDown(event => {
    // Handle click without preventDefault to avoid errors
    handleHtmlEditorClick(event, monacoEditor, mainEditor);
  });
  
  // Also handle click events for better compatibility
  monacoEditor.onDidChangeCursorPosition(event => {
    // This can be used for additional cursor-based selection if needed
  });
  
  // Disable navigation indicator to prevent unwanted line highlighting
  monacoEditor.updateOptions({
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    // Disable navigation features that cause issues
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    // Improve click handling
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 1,
    // Disable unwanted features
    renderWhitespace: 'none',
    renderLineHighlight: 'none'
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
  // Get the exact position where the user clicked
  const position = event.target.position;
  if (!position) return;
  
  const lineNumber = position.lineNumber;
  const column = position.column;
  
  // Use precise line content function to avoid any issues
  const lineContent = getPreciseLineContent(lineNumber, monacoEditor);
  if (!lineContent) return;
  
  // Store the current scroll position to prevent unwanted scrolling
  const currentScrollTop = monacoEditor.getScrollTop();
  const currentScrollLeft = monacoEditor.getScrollLeft();
  
  // First, try to extract ID from the current line only
  let elementId = extractIdFromLine(lineContent);
  
  // If no ID found on current line, try to find the tag on the same line
  if (!elementId) {
    // Look for any tag on the current line
    const tagMatch = lineContent.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/);
    if (tagMatch) {
      const tagName = tagMatch[1];
      // Only select by tag if we're on the same line as the tag
      selectComponentByTag(tagName, mainEditor);
      // Restore scroll position and cursor safely
      safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
      return;
    }
  }
  
  if (elementId) {
    selectComponentById(elementId, mainEditor);
    // Restore scroll position and cursor safely
    safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
    return;
  }
  
  // If no ID or tag found on the current line, try to find the closest component
  // by looking at the cursor position and finding the most relevant component
  const closestComponent = findClosestComponentByPosition(lineNumber, column, monacoEditor, mainEditor);
  if (closestComponent) {
    mainEditor.select(closestComponent);
    highlightSelectedComponent(mainEditor);
    // Restore scroll position and cursor safely
    safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
    return;
  }
  
  // If no component found, don't do anything
  // This prevents unwanted selections from nearby lines
}

// ===== PRECISE LINE SELECTION =====
function getPreciseLineContent(lineNumber, monacoEditor) {
  try {
    const model = monacoEditor.getModel();
    if (model && lineNumber >= 1 && lineNumber <= model.getLineCount()) {
      return model.getLineContent(lineNumber);
    }
  } catch (error) {
    console.warn('Error getting precise line content:', error);
  }
  return '';
}

// ===== SAFE SCROLL RESTORATION =====
function safeRestoreScrollPosition(monacoEditor, scrollTop, scrollLeft, lineNumber, column) {
  try {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      try {
        monacoEditor.setScrollTop(scrollTop);
        monacoEditor.setScrollLeft(scrollLeft);
        monacoEditor.setPosition({ lineNumber: lineNumber, column: column });
      } catch (error) {
        console.warn('Error in safeRestoreScrollPosition:', error);
      }
    });
  } catch (error) {
    console.warn('Error in safeRestoreScrollPosition outer:', error);
  }
}

// ===== FIND CLOSEST COMPONENT BY POSITION =====
function findClosestComponentByPosition(lineNumber, column, monacoEditor, mainEditor) {
  const allComponents = mainEditor.getComponents();
  let closestComponent = null;
  let minDistance = Infinity;
  
  // Get the current line content to analyze
  const currentLineContent = monacoEditor.getModel().getLineContent(lineNumber);
  
  // Look for any HTML structure in the current line
  const htmlMatch = currentLineContent.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/);
  if (htmlMatch) {
    const tagName = htmlMatch[1];
    
    // Find components that contain this tag
    const matchingComponents = allComponents.filter(component => {
      const componentHtml = component.toHTML();
      return componentHtml.includes(`<${tagName}`);
    });
    
    // If we found matching components, return the first one
    if (matchingComponents.length > 0) {
      return matchingComponents[0];
    }
  }
  
  // If no direct match, try to find the component that contains this line
  // by analyzing the HTML structure around the clicked line
  return findComponentByLineAnalysis(lineNumber, monacoEditor, mainEditor);
}

// ===== FIND COMPONENT BY LINE ANALYSIS =====
function findComponentByLineAnalysis(lineNumber, monacoEditor, mainEditor) {
  const allComponents = mainEditor.getComponents();
  const model = monacoEditor.getModel();
  const totalLines = model.getLineCount();
  
  // Get a range of lines around the clicked line to analyze context
  const startLine = Math.max(1, lineNumber - 2);
  const endLine = Math.min(totalLines, lineNumber + 2);
  
  let contextHtml = '';
  for (let i = startLine; i <= endLine; i++) {
    contextHtml += model.getLineContent(i) + '\n';
  }
  
  // Look for any HTML tags in the context
  const tagMatches = contextHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/g);
  if (tagMatches) {
    for (const tagMatch of tagMatches) {
      const tagName = tagMatch.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/)[1];
      
      // Find components that contain this tag
      const matchingComponents = allComponents.filter(component => {
        const componentHtml = component.toHTML();
        return componentHtml.includes(`<${tagName}`);
      });
      
      if (matchingComponents.length > 0) {
        return matchingComponents[0];
      }
    }
  }
  
  return null;
}

// ===== COMPONENT SELECTION =====
function selectComponentById(elementId, mainEditor) {
  try {
    // Get iframe content
    const iframe = document.querySelector('.gjs-frame');
    if (!iframe) {
      return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const bodyInIframe = iframeDoc.body;
    const wrapperInIframe = bodyInIframe.querySelector('[data-gjs-type="wrapper"]');
    
    if (!wrapperInIframe) {
      return;
    }

    // Find element by ID in iframe
    const targetElement = wrapperInIframe.querySelector(`#${elementId}`);
    if (!targetElement) {
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
      
    } else {
      console.warn(`Component with ID '${elementId}' not found in GrapesJS components`);
    }
      } catch (error) {
      // Error selecting component by ID
    }
}

function selectComponentByTag(tagName, mainEditor) {
  // Get all components and find the most specific match
  const allComponents = mainEditor.getComponents();
  let selectedComponent = null;
  
  // First, try to find exact tag match
  selectedComponent = allComponents.find(component => {
    const componentHtml = component.toHTML().trim();
    return componentHtml.startsWith(`<${tagName}`) && 
           (componentHtml.includes(`<${tagName} `) || componentHtml.includes(`<${tagName}>`));
  });
  
  // If no exact match, try to find any component with this tag
  if (!selectedComponent) {
    selectedComponent = allComponents.find(component => {
      const componentHtml = component.toHTML();
      return componentHtml.includes(`<${tagName}`);
    });
  }
  
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
        // allElements.forEach(el => {
        //   el.style.outline = '1px solid #0073aa';
        //   el.style.outlineOffset = '1px';
        // });
        
        // Remove highlight after 2 seconds
        // setTimeout(() => {
        //   allElements.forEach(el => {
        //     el.style.outline = '';
        //     el.style.outlineOffset = '';
        //   });
        // }, 2000);
      }
    }
    
    // Also highlight in GrapesJS canvas
    // mainEditor.Canvas.getBody().style.outline = '2px solid red';
    setTimeout(() => {
      mainEditor.Canvas.getBody().style.outline = '';
    }, 2000);
      } catch (error) {
      // Error highlighting component
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
      // Error updating CSS
    }
  });
  
  
  cssMonacoContainer.onDidFocusEditorText(() => {
    // Force layout update
    setTimeout(() => {
      cssMonacoContainer.layout();
    }, 100);
  });
  
  // Add model change event
  cssMonacoContainer.onDidChangeModelLanguageConfiguration(() => {
    console.log('CSS Editor language configuration changed');
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
      return null;
    }
  
  try {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    return iframeDocument;
      } catch (error) {
      return null;
    }
}

export function getIframeContentAsString() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return '';
  
  try {
    return iframeDocument.documentElement.outerHTML;
      } catch (error) {
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
      return '';
    }
}

// ===== IFRAME EVENT SETUP =====
export function setupIframeEvents() {
  const iframe = document.querySelector('.gjs-frame');
      if (!iframe) {
      return;
    }

  // Wait for iframe to load
  iframe.addEventListener('load', () => {
    setupIframeContentEvents();
  });

  // Also try to setup immediately if iframe is already loaded
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    setupIframeContentEvents();
  }
}

function setupIframeContentEvents() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return;

  try {
    // Add event listeners to iframe document
    iframeDocument.addEventListener('DOMContentLoaded', () => {
    });

    iframeDocument.addEventListener('load', () => {
    });

    // Monitor for changes in the iframe content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
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
      // Error setting up iframe events
    }
}

// ===== DEBUG FUNCTIONS =====
// export function debugIframeContent() {
//   const iframe = document.querySelector('.gjs-frame');

//   if (!iframe) {
//     return;
//   }

  
//   try {
//     const iframe = document.querySelector('.gjs-frame');
//     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//     const bodyInIframe = iframeDoc.body;
//     const wrapperInIframe = bodyInIframe.querySelector('[data-gjs-type="wrapper"]');

//   } catch (error) {
//     console.error('Error accessing iframe content:', error);
//   }
// }

// ===== MONACO STATUS CHECK =====
export function checkMonacoStatus() {
  // Monaco Editor Status check
}

// ===== FORCE MONACO RELOAD =====
export function forceMonacoReload(mainEditor, editorContainer) {

  
  // Dispose existing editors
  disposeExistingEditors();
  
  // Clear containers
  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  clearContainers(htmlContainer, cssContainer);
  
  // Wait a bit and reinitialize
  setTimeout(() => {
    if (window.monaco) {
      initMonacoEditors(mainEditor, htmlContainer, cssContainer);
      setupEditorsLayout();
      setupDefaultContent();
      formatEditors();
          // Monaco editors reloaded successfully
  } else {
    // Monaco not available, trying to reload
      initializeMonacoEditors(mainEditor, editorContainer);
    }
  }, 500);
}



// ===== FIX CSS EDITOR ISSUES =====
export function fixCssEditorIssues() {
  if (!window.cssMonacoContainer) {
    return;
  }
  
  try {
    // Recreate the CSS editor with better settings
    const container = window.cssMonacoContainer.getContainerDomNode();
    const currentValue = window.cssMonacoContainer.getValue();
    
    // Dispose current editor
    window.cssMonacoContainer.dispose();
    
    // Create new editor with enhanced settings
    window.cssMonacoContainer = monaco.editor.create(container, {
      value: currentValue,
      language: 'css',
      theme: 'vs-dark',
      automaticLayout: true,
      wordWrap: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14
    });
    
    // Re-setup events
    setupCssEditorEvents(window.cssMonacoContainer, window.mainEditor);
    
    // CSS editor recreated with enhanced settings
  } catch (error) {
    // Error fixing CSS editor issues
  }
}

// ===== RELOAD MONACO WITH CDN =====
export function reloadMonacoWithCDN(mainEditor, editorContainer) {

  
  // Dispose existing editors
  disposeExistingEditors();
  
  // Clear containers
  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  clearContainers(htmlContainer, cssContainer);
  
  // Clear require cache
  if (window.require && window.require.undef) {
    window.require.undef('vs/editor/editor.main');
  }
  
  // Wait a bit and reinitialize
  setTimeout(() => {
    if (window.monaco) {
      initMonacoEditors(mainEditor, htmlContainer, cssContainer);
      setupEditorsLayout();
      setupDefaultContent();
      formatEditors();
      

      
      // Monaco reloaded successfully with CDN
    } else {
      // Monaco not available, trying to reload
      initializeMonacoEditors(mainEditor, editorContainer);
    }
  }, 500);
}



// ===== DIAGNOSE CDN ISSUES =====
export function diagnoseCDNIssues() {
  // Check if Monaco is loaded from CDN
  if (!window.monaco) {
    return false;
  }
  
  // Check if editors exist
  if (!window.monacoEditor) {
    return false;
  }
  
  if (!window.cssMonacoContainer) {
    return false;
  }
  
  // Check language services
  if (!window.monaco.languages) {
    return false;
  }
  
  // Check if models are working
  try {
    const htmlModel = window.monacoEditor.getModel();
    const cssModel = window.cssMonacoContainer.getModel();
    
    if (!htmlModel || !cssModel) {
      console.error('❌ Editor models not working');
      return false;
    }
    
    
    // Test IntelliSense
    window.monacoEditor.focus();
    window.monacoEditor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    
    window.cssMonacoContainer.focus();
    window.cssMonacoContainer.trigger('keyboard', 'editor.action.triggerSuggest', {});
    
    // IntelliSense triggered
    
    return true;
  } catch (error) {
    // Error testing editors
    return false;
  }
}

// ===== FIX CDN ISSUES =====
export function fixCDNIssues() {
  // Step 1: Diagnose issues
  const isHealthy = diagnoseCDNIssues();
  
  if (!isHealthy) {
    // CDN has issues, attempting fixes
    
    // Step 2: Reload Monaco with CDN
    if (window.mainEditor) {
      const editorContainer = document.querySelector('#editorContainer') || 
                            document.querySelector('.editor-container');
      if (editorContainer) {
        // Reloading Monaco with CDN
        reloadMonacoWithCDN(window.mainEditor, editorContainer);
      }
    }
  } else {
    // CDN is healthy
  }
}

// ===== CONSOLE ACCESSIBLE FUNCTIONS =====
// Make functions accessible from console
window.reloadMonacoWithCDN = function() {
  if (window.mainEditor) {
    const editorContainer = document.querySelector('#editorContainer') || 
                          document.querySelector('.editor-container');
    if (editorContainer) {
      reloadMonacoWithCDN(window.mainEditor, editorContainer);
    } else {
      // Editor container not found
    }
  } else {
    // Main editor not found
  }
};



window.diagnoseCDNIssues = function() {
  diagnoseCDNIssues();
};

window.fixCDNIssues = function() {
  fixCDNIssues();
};





// ===== SIMPLE FIX =====
window.simpleFix = function() {
  // Create containers
  const htmlContainer = document.querySelector('#htmlEditor') || document.createElement('div');
  const cssContainer = document.querySelector('#cssEditor') || document.createElement('div');
  
  if (!htmlContainer.id) {
    htmlContainer.id = 'htmlEditor';
    htmlContainer.style.height = '300px';
    htmlContainer.style.border = '1px solid #ccc';
    document.body.appendChild(htmlContainer);
  }
  
  if (!cssContainer.id) {
    cssContainer.id = 'cssEditor';
    cssContainer.style.height = '300px';
    cssContainer.style.border = '1px solid #ccc';
    document.body.appendChild(cssContainer);
  }
  
  // Create editors
  if (window.monaco && window.monaco.editor) {
    window.monacoEditor = window.monaco.editor.create(htmlContainer, {
      value: '<div>Hello World</div>',
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      wordWrap: "on",
      minimap: { enabled: false },
      fontSize: 14
    });
    
    window.cssMonacoContainer = window.monaco.editor.create(cssContainer, {
      value: 'body {\n  color: black;\n}',
      language: 'css',
      theme: 'vs-dark',
      automaticLayout: true,
      wordWrap: "on",
      minimap: { enabled: false },
      fontSize: 14
    });
  }
};

// Auto execute
setTimeout(() => {
  simpleFix();
}, 2000);