import { setupComponentNavigation } from '../functions/monaco-navigation-indicator.js';
import { tryAutoRenameHtmlTag } from '../functions/auto-rename-tag.js';
import { formatHtmlCode, formatCssCode } from '../functions/monaco-clean-code.js';
import { updateEditorWithFormat } from '../functions/monaco-update-code.js';
import { getCombinedCSSClasses, createMonacoSuggestions, createSmartHtmlSuggestions } from '../functions/css-classes.js';

if (!sessionStorage.getItem('tabId')) {
  const newTabId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  sessionStorage.setItem('tabId', newTabId);
}
const tabId = sessionStorage.getItem('tabId');

const MONACO_CONFIG = {
  CDN_URL: './assets/vendors/mizban/playground',
  EDITOR_OPTIONS: {
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 1,
    renderWhitespace: 'none',
    renderLineHighlight: 'line',
    workers: {
      enabled: false
    }
  }
};

const ADVANCED_MONACO_OPTIONS = {
  folding: { enabled: true },
  foldingStrategy: 'auto',
  showFoldingControls: 'always',
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  autoIndent: 'full',
  formatOnType: true,
  formatOnPaste: true,
  formatOnSave: true,

  suggest: {
    showKeywords: true,
    showSnippets: true,
    showClasses: true,
    showFunctions: true,
    showVariables: true,
    showConstants: true,
    showEnums: true,
    showEnumsMembers: true,
    showColors: true,
    showFiles: true,
    showReferences: true,
    showFolders: true,
    showTypeParameters: true,
    showWords: true,
    showUsers: true,
    showIssues: true,
    showCustomcolors: true,
    showDeprecated: true,
    showInterfaces: true,
    showModules: true,
    showProperties: true,
    showEvents: true,
    showOperators: true,
    showUnits: true,
    showValues: true,
    showConstructors: true,
    showFields: true,
    showMethods: true,
    showFunctions: true,
    showVariables: true,
    showConstants: true,
    showEnums: true,
    showEnumMembers: true,
    showKeywords: true,
    showWords: true,
    showColors: true,
    showFiles: true,
    showReferences: true,
    showFolders: true,
    showTypeParameters: true,
    showUsers: true,
    showIssues: true,
    showCustomcolors: true,
    showDeprecated: true,
    showInterfaces: true,
    showModules: true,
    showProperties: true,
    showEvents: true,
    showOperators: true,
    showUnits: true,
    showValues: true
  },
  
  links: { enabled: true },
  hover: { enabled: true },
  contextmenu: { enabled: true },
  quickSuggestionsDelay: 10,
  parameterHints: { enabled: true },
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: 'on',
  
  validateOnType: true,
  validateOnPaste: true,
  
  wordBasedSuggestions: true,
  suggestSelection: 'first',
  suggestFilterGraceful: true,
  suggestSnippetsPreventQuickSuggestions: false,
  suggestShowKeywords: true,
  suggestShowSnippets: true,
  suggestShowClasses: true,
  suggestShowFunctions: true,
  suggestShowVariables: true,
  suggestShowConstants: true,
  suggestShowEnums: true,
  suggestShowEnumsMembers: true,
  suggestShowColors: true,
  suggestShowFiles: true,
  suggestShowReferences: true,
  suggestShowFolders: true,
  suggestShowTypeParameters: true,
  suggestShowWords: true,
  suggestShowUsers: true,
  suggestShowIssues: true,
  
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  
  renderWhitespace: 'selection',
  renderControlCharacters: true,
  renderLineHighlight: 'all',
  renderValidationDecorations: 'on',
  renderFinalNewline: true,
  renderLineNumbers: 'on',
  renderIndentGuides: true,
  renderValidationDecorations: 'on',
  
  largeFileOptimizations: true,
  maxTokenizationLineLength: 20000,
  maxTokenizationLineLength: 20000,
  
  accessibilitySupport: 'auto',
  screenReaderAnnounceNewLine: true,

  mouseWheelScrollSensitivity: 1,
  fastScrollSensitivity: 1,
  scrollBeyondLastLine: false,
  scrollBeyondLastColumn: 5,

  multiCursorModifier: 'alt',
  multiCursorPaste: 'full',
  multiCursorMergeOverlapping: true,
  

  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: 'never',
    seedSearchStringFromSelection: 'always',
    globalFindClipboard: false
  },
  

  minimap: { 
    enabled: true,
    maxColumn: 120,
    renderCharacters: true,
    showSlider: 'mouseover',
    side: 'right',
    size: 'proportional'
  },
  

  overviewRulerLanes: 3,
  overviewRulerBorder: true,
  hideCursorInOverviewRuler: false,
  

  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
    verticalScrollbarSize: 14,
    horizontalScrollbarSize: 14,
    useShadows: true,
    verticalHasArrows: false,
    horizontalHasArrows: false
  }
};


function setupGrapesJSToMonacoSync(mainEditor) {

  if (window.grapesJSSyncSetup) return;
  window.grapesJSSyncSetup = true;
  

  mainEditor.on('block:drag:stop', () => {

  });
  mainEditor.on('run:core:undo', () => {

  });
  mainEditor.on('run:core:redo', () => {

  });
  mainEditor.on('run:core:canvas-clear', () => {

  });
  mainEditor.on('component:add', () => {

  });
  mainEditor.on('component:remove', () => {

  });
  let updateTimer = null;
  window.isFromMonaco = false;
  window.isUserTyping = false;
  window.hasUserTyped = false;
  window.typingTimer = null;
  
  mainEditor.on('change', () => {
    if (window.isFromMonaco) {
      window.isFromMonaco = false;
      return;
    }
    
    if (window.isUserTyping) {
      return;
    }
    if (!window.hasUserTyped) {
      return;
    }

    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updateMonacoFromGrapesJS(mainEditor);
    }, 2000);
  });
  mainEditor.on('component:selected', () => {});mainEditor.on('style:add', () => {});mainEditor.on('style:remove', () => {});mainEditor.on('style:update', () => {});
}

function updateMonacoFromGrapesJS(mainEditor) {
  if (!window.monacoEditor || !window.cssMonacoContainer) return;
  
  if (window.isUpdatingFromGrapesJS) return;
  window.isUpdatingFromGrapesJS = true;
  
  try {
    updateEditorWithFormat(mainEditor);
    
    
    const htmlCode = mainEditor.getHtml();
    const cssCode = mainEditor.getCss();
    console.log('HTML Code:', htmlCode);
    console.log('CSS Code:', cssCode);
    updateLivePreview(htmlCode, cssCode);
  } catch (error) {
    console.error('Error updating Monaco from GrapesJS:', error);
  } finally {
    
    window.isUpdatingFromGrapesJS = false;
  }
}


export function initializeMonacoEditors(mainEditor, editorContainer) {
  
  window.monacoInitialized = false;
  window.monacoEditor = null;
  window.cssMonacoContainer = null;

  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  const htmlImportCodeContainer = editorContainer.querySelector('#htmlImportCodeContainer');

  if (!htmlContainer || !cssContainer || !htmlImportCodeContainer) {

    return;
  }

  window.mainEditor = mainEditor;
  window.isUpdatingFromGrapesJS = false;

  setupMonacoRequire();
  setupCleanCodeButton();
  setupIframeEvents();
  setupAdvancedMonacoFeatures();

  
  require(['vs/editor/editor.main'], () => {
    const initMonaco = () => {
      if (window.monaco && window.monaco.editor) {
        window.monaco.editor.defineTheme('vs-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {}
        });
        disposeExistingEditors();
        clearContainers(htmlContainer, cssContainer, htmlImportCodeContainer);
        initMonacoEditors(mainEditor, htmlContainer, cssContainer , htmlImportCodeContainer);
        setupGrapesJSToMonacoSync(mainEditor);
        setupEditorsLayout();
        setupDefaultContent();
        formatEditors();
        window.monacoInitialized = true;
      } else {
        setTimeout(initMonaco, 50);
      }
    };
    initMonaco();
  });
}


function setupMonacoRequire() {
  
  if (window.monaco) {
    return;
  }
  
  
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = function(...args) {
    const errorMessage = args[0] ? String(args[0]) : '';
    if (errorMessage.includes('workerMain.js') || 
        errorMessage.includes('Not Found') ||
        errorMessage.includes('404') ||
        errorMessage.includes('worker') ||
        errorMessage.includes('workerMain') ||
        errorMessage.includes('unexpectedErrorHandler') ||
        errorMessage.includes('editor.main.js')) {
      return; 
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const warningMessage = args[0] ? String(args[0]) : '';
    if (warningMessage.includes('worker') || 
        warningMessage.includes('Worker') ||
        warningMessage.includes('unexpectedErrorHandler') ||
        warningMessage.includes('editor.main.js')) {
      return; 
    }
    originalConsoleWarn.apply(console, args);
  };
  
  require.config({
    paths: { 
      'vs': MONACO_CONFIG.CDN_URL + '/vs'
    }
  });
  
  
  const hasRequire = typeof window.require === 'function' && typeof window.require.config === 'function';
  const hasLoaderScript = document.querySelector(`script[src*="${MONACO_CONFIG.CDN_URL}/vs/loader.min.js"]`) ||
                          document.querySelector(`script[src*="${MONACO_CONFIG.CDN_URL}/vs/loader.js"]`) ||
                          document.querySelector('script[src$="/vs/loader.js"]') ||
                          document.querySelector('script[src$="/vs/loader.min.js"]');
  if (!hasRequire && !hasLoaderScript) {
      const script = document.createElement('script');
      script.src = MONACO_CONFIG.CDN_URL + '/vs/loader.min.js';
      document.head.appendChild(script);
    }

  
  if (!document.querySelector(`script[src*="${MONACO_CONFIG.CDN_URL}/emmet-monaco-es/dist/emmet-monaco.js"]`)) {
    const emmetMonacoScript = document.createElement('script');
    emmetMonacoScript.src = MONACO_CONFIG.CDN_URL + '/emmet-monaco-es/dist/emmet-monaco.js';
    document.head.appendChild(emmetMonacoScript);
    }
}





function setupCleanCodeButton() {
  document.querySelector('#cleanCode')?.addEventListener('click', () => {
    if (window.monacoEditor) {
      const htmlCode = window.monacoEditor.getValue();
      window.monacoEditor.setValue(formatHtmlCode(htmlCode));
    }
    
    if (window.cssMonacoContainer) {
      const cssCode = window.cssMonacoContainer.getValue();
      window.cssMonacoContainer.setValue(formatCssCode(cssCode));
    }
  });
}

function setupAdvancedMonacoFeatures() {
  window.enableAdvancedMonacoFeatures = function() {
    if (window.monacoEditor) {
      window.monacoEditor.updateOptions({
        workers: { enabled: true },
        links: { enabled: true },
        folding: { enabled: true },
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        autoIndent: 'full',
        formatOnType: true,
        formatOnPaste: true,
        wordBasedSuggestions: true,
        quickSuggestions: { other: true, comments: true, strings: true },
        parameterHints: { enabled: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        
      });
    }
    
    if (window.cssMonacoContainer) {
      window.cssMonacoContainer.updateOptions({
        workers: { enabled: true },
        links: { enabled: true },
        folding: { enabled: true },
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        autoIndent: 'full',
        formatOnType: true,
        formatOnPaste: true,
        wordBasedSuggestions: true,
        quickSuggestions: { other: true, comments: true, strings: true },
        parameterHints: { enabled: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        
      });
    }
    
    console.log('✅ Advanced features enabled');
  };
  
  window.disableAdvancedMonacoFeatures = function() {
    if (window.monacoEditor) {
      window.monacoEditor.updateOptions({
        workers: { enabled: false },
        links: { enabled: false },
        folding: { enabled: false },
        bracketPairColorization: { enabled: false },
        guides: { bracketPairs: false },
        formatOnType: false,
        formatOnPaste: false
      });
    }
    
    if (window.cssMonacoContainer) {
      window.cssMonacoContainer.updateOptions({
        workers: { enabled: false },
        links: { enabled: false },
        folding: { enabled: false },
        bracketPairColorization: { enabled: false },
        guides: { bracketPairs: false },
        formatOnType: false,
        formatOnPaste: false
      });
    }
    
    console.log('❌ Advanced features disabled');
  };
  window.showMonacoFeaturesStatus = function () {
    console.log('🎯 Monaco Status:');
    console.log('HTML Editor:', !!window.monacoEditor);
    console.log('CSS Editor:', !!window.cssMonacoContainer);
    console.log('Monaco Object:', !!window.monaco);
    console.log('Languages Support:', !!window.monaco?.languages);
    console.log('✅ Advanced features enabled');
  };

  window.disableAdvancedMonacoFeatures = function () {
    const disabledOptions = {
      workers: { enabled: false },
      links: { enabled: false },
      folding: { enabled: false },
      bracketPairColorization: { enabled: false },
      guides: { bracketPairs: false },
      formatOnType: false,
      formatOnPaste: false
    };

    if (window.monacoEditor) {
      window.monacoEditor.updateOptions(disabledOptions);
    }

    if (window.cssMonacoContainer) {
      window.cssMonacoContainer.updateOptions(disabledOptions);
    }

    console.log('❌ Advanced features disabled');
  };
}

function initMonacoEditors(mainEditor, htmlContainer, cssContainer , htmlImportCodeContainer) {
  const currentHtml = mainEditor.getHtml() || '';
  const currentCss = mainEditor.getCss() || '';
  const currenthtmlImportCode = mainEditor.getHtmlImportCode 
                                ? mainEditor.getHtmlImportCode() 
                                : '';

  window.monacoEditor = createHtmlEditor(htmlContainer, currentHtml);
  window.cssMonacoContainer = createCssEditor(cssContainer, formatCssString(currentCss));
  window.htmlImportCodeContainer = createHtmlEditor(htmlImportCodeContainer, currenthtmlImportCode);

  setupHtmlEditorEvents(window.monacoEditor, mainEditor);
  setupCssEditorEvents(window.cssMonacoContainer, mainEditor);
  setupComponentNavigation(mainEditor);
  
  setupCSSSuggestions();

  try { window._htmlPrevValue = currentHtml; } catch (e) {}

  try {
    if (window.emmetMonaco && typeof window.emmetMonaco.emmetHTML === 'function') {
      window.emmetMonaco.emmetHTML(window.monaco, ['html']);
    }
  } catch (e) {}
}

function createHtmlEditor(container, value) {
  return monaco.editor.create(container, {
    value: value,
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 1,
    renderWhitespace: 'none',
    renderLineHighlight: 'line',
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showEnums: true,
      showEnumsMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showWords: true,
      showUsers: true,
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    },
    
    workers: { enabled: true },
    links: { enabled: true },
    hover: { enabled: true },
    contextmenu: { enabled: true },
    quickSuggestionsDelay: 10,
    parameterHints: { enabled: true },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    folding: { enabled: true },
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
    autoIndent: 'full',
    formatOnType: true,
    formatOnPaste: true,
    wordBasedSuggestions: true
  });
}

function createCssEditor(container, value) {
  return monaco.editor.create(container, {
    value: value,
    language: 'css',
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 1,
    renderWhitespace: 'none',
    renderLineHighlight: 'line',
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showEnums: true,
      showEnumsMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showWords: true,
      showUsers: true,
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    },
    
    workers: { enabled: true },
    links: { enabled: true },
    hover: { enabled: true },
    contextmenu: { enabled: true },
    quickSuggestionsDelay: 10,
    parameterHints: { enabled: true },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    folding: { enabled: true },
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
    autoIndent: 'full',
    formatOnType: true,
    formatOnPaste: true,
    wordBasedSuggestions: true
  });
}

function setupHtmlEditorEvents(monacoEditor, mainEditor) {
  monacoEditor.onDidChangeModelContent((e) => {
    const code = monacoEditor.getValue();
    
    if (window.isUpdatingFromGrapesJS || window.isAutoRenamingTag || (window.preventAutoFormatting && window.preventAutoFormatting())) {
      return;
    }
    
    tryAutoRenameHtmlTag(e, monacoEditor);
    
    window.isUserTyping = true;
    window.hasUserTyped = true;
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      window.isUserTyping = false;
    }, 2000);
    
    try {
      window.isFromMonaco = true;
      
      mainEditor.DomComponents.getWrapper().set('content', '');
      mainEditor.setComponents(code.trim());
      mainEditor.store();
      updateLivePreview(code, window.cssMonacoContainer?.getValue() || '');
    } catch (error) {
      console.error('Error updating HTML:', error);
    }

    try { window._htmlPrevValue = code; } catch (e) {}
  });
  
  monacoEditor.onMouseDown(event => {
    handleHtmlEditorClick(event, monacoEditor, mainEditor);
  });
  
  monacoEditor.updateOptions({
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showEnums: true,
      showEnumsMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showWords: true,
      showUsers: true,
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    }
  });
}

function setupCssEditorEvents(cssMonacoContainer, mainEditor) {
  cssMonacoContainer.onDidChangeModelContent(() => {
    const cssCodeValue = cssMonacoContainer.getValue();
    
    if (window.isUpdatingFromGrapesJS || (window.preventAutoFormatting && window.preventAutoFormatting())) {
      return;
    }
    
    window.isUserTyping = true;
    window.hasUserTyped = true;
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      window.isUserTyping = false;
      updateCSSSuggestions();
    }, 1000);
    
    try {
      window.isFromMonaco = true;
      
      mainEditor.setStyle(cssCodeValue);
      mainEditor.store();
      updateLivePreview(window.monacoEditor?.getValue() || '', cssCodeValue);
    } catch (error) {
      console.error('Error updating CSS:', error);
    }
  });
  
  cssMonacoContainer.updateOptions({
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showEnums: true,
      showEnumsMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showWords: true,
      showUsers: true,
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    }
  });
  
  cssMonacoContainer.onDidFocusEditorText(() => {
    cssMonacoContainer.layout();
  });
}

function setupHtmlImportCodeEditorEvents(monacoEditor, mainEditor) {
  monacoEditor.onDidChangeModelContent((e) => {
    const code = monacoEditor.getValue();
    
    if (window.isUpdatingFromGrapesJS || window.isAutoRenamingTag || (window.preventAutoFormatting && window.preventAutoFormatting())) {
      return;
    }
    
    tryAutoRenameHtmlTag(e, monacoEditor);
    
    window.isUserTyping = true;
    window.hasUserTyped = true;
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      window.isUserTyping = false;
    }, 2000);
    
    try {
      window.isFromMonaco = true;
      
      mainEditor.DomComponents.getWrapper().set('content', '');
      mainEditor.setComponents(code.trim());
      mainEditor.store();
      updateLivePreview(code, window.cssMonacoContainer?.getValue() || '');
    } catch (error) {
      console.error('Error updating HTML:', error);
    }

    try { window._htmlPrevValue = code; } catch (e) {}
  });
  
  monacoEditor.onMouseDown(event => {
    handleHtmlEditorClick(event, monacoEditor, mainEditor);
  });
  
  monacoEditor.updateOptions({
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showEnums: true,
      showEnumsMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showWords: true,
      showUsers: true,
      showIssues: true
    },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    }
  });
}

function handleHtmlEditorClick(event, monacoEditor, mainEditor) {
  const position = event.target.position;
  if (!position) return;
  
  const lineNumber = position.lineNumber;
  const column = position.column;
  const lineContent = getPreciseLineContent(lineNumber, monacoEditor);
  
  if (!lineContent) return;
  
  const currentScrollTop = monacoEditor.getScrollTop();
  const currentScrollLeft = monacoEditor.getScrollLeft();
  
  window.lastClickPosition = {
    position: { lineNumber, column },
    timestamp: Date.now()
  };
  
  let elementId = extractIdFromLine(lineContent);
  
  if (!elementId) {
    const tagMatch = lineContent.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/);
    if (tagMatch) {
      window.lastClickPosition.tagName = tagMatch[1];
      selectComponentByTag(tagMatch[1], mainEditor);
      safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
      return;
    }
  }
  
  if (elementId) {
    window.lastClickPosition.componentId = elementId;
    selectComponentById(elementId, mainEditor);
    safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
    return;
  }
  
  const closestComponent = findClosestComponentByPosition(lineNumber, column, monacoEditor, mainEditor);
  if (closestComponent) {
    mainEditor.select(closestComponent);
    highlightSelectedComponent(mainEditor);
    safeRestoreScrollPosition(monacoEditor, currentScrollTop, currentScrollLeft, lineNumber, column);
  }
}

function selectComponentById(elementId, mainEditor) {
  try {
    const iframe = document.querySelector('.gjs-frame');
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const wrapperInIframe = iframeDoc.body.querySelector('[data-gjs-type="wrapper"]');
    
    if (!wrapperInIframe) return;

    const targetElement = wrapperInIframe.querySelector(`#${elementId}`);
    if (!targetElement) return;

    const selectedComponent = mainEditor.getComponents().find(component => {
      const componentHtml = component.toHTML();
      return componentHtml.includes(`id="${elementId}"`) || componentHtml.includes(`id='${elementId}'`);
    });

    if (selectedComponent) {
      mainEditor.select(selectedComponent);
      targetElement.click();
      highlightSelectedComponent(mainEditor);
    }
  } catch (error) {
    console.warn('Error selecting component by ID:', error);
  }
}

function selectComponentByTag(tagName, mainEditor) {
  const allComponents = mainEditor.getComponents();
  
  let selectedComponent = allComponents.find(component => {
    const componentHtml = component.toHTML().trim();
    return componentHtml.startsWith(`<${tagName}`) && 
          (componentHtml.includes(`<${tagName} `) || componentHtml.includes(`<${tagName}>`));
  });
  
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

function highlightSelectedComponent(mainEditor) {
  try {
    mainEditor.Canvas.getBody().style.outline = '';
  } catch (error) {
    console.warn('Error highlighting component:', error);
  }
}

function extractIdFromLine(lineContent) {
  const idMatch = lineContent.match(/id=["']([^"']+)["']/);
  return idMatch ? idMatch[1] : null;
}

function getPreciseLineContent(lineNumber, monacoEditor) {
  try {
    const model = monacoEditor.getModel();
    if (model && lineNumber >= 1 && lineNumber <= model.getLineCount()) {
      return model.getLineContent(lineNumber);
    }
  } catch (error) {
    console.warn('Error getting line content:', error);
  }
  return '';
}

function safeRestoreScrollPosition(monacoEditor, scrollTop, scrollLeft, lineNumber, column) {
  try {
    requestAnimationFrame(() => {
      try {
        monacoEditor.setScrollTop(scrollTop);
        monacoEditor.setScrollLeft(scrollLeft);
        monacoEditor.setPosition({ lineNumber, column });
      } catch (error) {
        console.warn('Error restoring scroll position:', error);
      }
    });
  } catch (error) {
    console.warn('Error in scroll restoration:', error);
  }
}

function findClosestComponentByPosition(lineNumber, column, monacoEditor, mainEditor) {
  const currentLineContent = monacoEditor.getModel().getLineContent(lineNumber);
  const htmlMatch = currentLineContent.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/);
  
  if (htmlMatch) {
    const tagName = htmlMatch[1];
    const allComponents = mainEditor.getComponents();
    
    const matchingComponents = allComponents.filter(component => {
      const componentHtml = component.toHTML();
      return componentHtml.includes(`<${tagName}`);
    });
    
    if (matchingComponents.length > 0) {
      return matchingComponents[0];
    }
  }
  
  return findComponentByLineAnalysis(lineNumber, monacoEditor, mainEditor);
}

function findComponentByLineAnalysis(lineNumber, monacoEditor, mainEditor) {
  const allComponents = mainEditor.getComponents();
  const model = monacoEditor.getModel();
  const totalLines = model.getLineCount();
  
  const startLine = Math.max(1, lineNumber - 2);
  const endLine = Math.min(totalLines, lineNumber + 2);
  
  let contextHtml = '';
  for (let i = startLine; i <= endLine; i++) {
    contextHtml += model.getLineContent(i) + '\n';
  }
  
  const tagMatches = contextHtml.match(/<([a-zA-Z][a-zA-Z0-9\-]*)(?:\s+[^>]*)?/g);
  if (tagMatches) {
    for (const tagMatch of tagMatches) {
      const tagName = tagMatch.match(/<([a-zA-Z][a-zA-Z0-9\-]*)/)[1];
      
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

function clearContainers(htmlContainer, cssContainer, htmlImportCodeContainer) {
  htmlContainer.innerHTML = '';
  cssContainer.innerHTML = '';
  htmlImportCodeContainer.innerHTML = '';

  ['data-monaco-editor', 'data-context', 'data-editor-type'].forEach(attr => {
    htmlContainer.removeAttribute(attr);
    cssContainer.removeAttribute(attr);
    htmlImportCodeContainer.removeAttribute(attr);
  });
  
  htmlContainer.className = htmlContainer.className.replace(/monaco-editor/g, '').trim();
  cssContainer.className = cssContainer.className.replace(/monaco-editor/g, '').trim();
  htmlImportCodeContainer.className = htmlImportCodeContainer.className.replace(/monaco-editor/g, '').trim();
}

function disposeExistingEditors() {
  try {
    if (window.monacoEditor) {
      window.monacoEditor.dispose();
      window.monacoEditor = null;
    }
    if (window.cssMonacoContainer) {
      window.cssMonacoContainer.dispose();
      window.cssMonacoContainer = null;
    }
  } catch (error) {
    console.warn('Error disposing editors:', error);
  }
  
  window.isUpdatingFromGrapesJS = false;
  window.monacoInitialized = false;
  
  const htmlContainer = document.querySelector('#htmlEditor');
  const cssContainer = document.querySelector('#cssEditor');
  const htmlImportCodeContainer = document.querySelector('#htmlImportCodeContainer');

  if (htmlContainer) {
    htmlContainer.removeAttribute('data-monaco-editor');
    htmlContainer.removeAttribute('data-context');
  }
  
  if (cssContainer) {
    cssContainer.removeAttribute('data-monaco-editor');
    cssContainer.removeAttribute('data-context');
  }

  if (htmlImportCodeContainer) {
    htmlImportCodeContainer.removeAttribute('data-monaco-editor');
    htmlImportCodeContainer.removeAttribute('data-context');
  }
}

function formatCssString(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/\s*{\s*/g, ' {\n\t')
    .replace(/\s*;\s*/g, ';\n\t')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\t}/g, '}')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

function setupEditorsLayout() {
  if (window.monacoEditor) window.monacoEditor.layout();
  if (window.cssMonacoContainer) window.cssMonacoContainer.layout();
}

function setupDefaultContent() {
  try {
    if (window.monacoEditor && !window.monacoEditor.getValue().trim()) {
      window.monacoEditor.setValue(' ');
    }
    
    if (window.cssMonacoContainer && !window.cssMonacoContainer.getValue().trim()) {
      window.cssMonacoContainer.setValue(' ');
    }
  } catch (error) {
    console.warn('Error setting default content:', error);
  }
}

function formatEditors() {
  const formatWithRetry = (attempts = 0) => {
    if (attempts > 10) {
      console.warn('❌ Failed to format editors after 10 attempts');
      return;
    }
    
    if (window.monacoEditor && window.cssMonacoContainer) {
      try {
        window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
        window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
        
        window.lastFormattedHtml = window.monacoEditor.getValue();
        window.lastFormattedCss = window.cssMonacoContainer.getValue();
        
      } catch (error) {
        console.warn('Format attempt failed, retrying...', error);
        if (attempts < 5) {
          setTimeout(() => formatWithRetry(attempts + 1), 50);
        }
      }
    } else if (attempts < 5) {
      setTimeout(() => formatWithRetry(attempts + 1), 50);
    }
  };

  formatWithRetry();
}

export function setupIframeEvents() {
  const iframe = document.querySelector('.gjs-frame');
  if (!iframe) return;

  iframe.addEventListener('load', setupIframeContentEvents);
  
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    setupIframeContentEvents();
  }
}

function setupIframeContentEvents() {
  const iframeDocument = getIframeContent();
  if (!iframeDocument) return;

  try {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
        }
      });
    });

    observer.observe(iframeDocument.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  } catch (error) {
    console.warn('Error setting up iframe events:', error);
  }
}

export function getIframeContent() {
  const iframe = document.querySelector('.gjs-frame');
  if (!iframe) return null;
  
  try {
    return iframe.contentDocument || iframe.contentWindow.document;
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

function updateLivePreview(htmlCode, cssCode) {
  try {
    const timestamp = Date.now();
    localStorage.setItem(`previewHtml-${tabId}`, htmlCode);
    localStorage.setItem(`previewCss-${tabId}`, cssCode);
    localStorage.setItem(`previewTimestamp-${tabId}`, timestamp);
    
    if (window.previewManager?.previewWindow && !window.previewManager.previewWindow.closed) {
      try {
        window.previewManager.previewWindow.postMessage({
          type: 'UPDATE_PREVIEW',
          html: htmlCode,
          css: cssCode,
          previewId: tabId,
          timestamp
        }, '*');
      } catch (error) {
        console.warn('Could not send message to preview window:', error);
      }
    }
  } catch (error) {
    console.error('Error updating live preview:', error);
  }
}

// function formatEditorsAfterGrapesJSUpdate() {
//   if (window.monacoEditor) {
//     try {
//       window.monacoEditor.trigger('anyString', 'editor.action.formatDocument');
//     } catch (error) {
//       console.warn('Could not format HTML after GrapesJS update:', error);
//     }
//   }
  
//   if (window.cssMonacoContainer) {
//     try {
//       window.cssMonacoContainer.trigger('anyString', 'editor.action.formatDocument');
//     } catch (error) {
//       console.warn('Could not format CSS after GrapesJS update:', error);
//     }
//   }
// }

window.preventAutoFormatting = function() {
  if (window.monacoEditor && window.lastFormattedHtml) {
    const currentHtml = window.monacoEditor.getValue();
    if (currentHtml === window.lastFormattedHtml) {
      return true;
    }
  }
  
  if (window.cssMonacoContainer && window.lastFormattedCss) {
    const currentCss = window.cssMonacoContainer.getValue();
    if (currentCss === window.lastFormattedCss) {
      return true;
    }
  }
  
  return false;
};

window.clearMonacoContext = function() {
  const htmlContainer = document.querySelector('#htmlEditor');
  const cssContainer = document.querySelector('#cssEditor');
  const htmlImportCodeContainer = document.querySelector('#htmlImportCodeContainer');

  [htmlContainer, cssContainer , htmlImportCodeContainer].forEach(container => {
    if (container) {
      const attributes = container.getAttributeNames();
      attributes.forEach(attr => {
        if (attr.includes('context') || attr.includes('monaco')) {
          container.removeAttribute(attr);
        }
      });
    }
  });
  

};

window.checkMonacoStatus = function() {
  console.log('Monaco Editor Status:');
  console.log('Monaco available:', !!window.monaco);
  console.log('HTML Editor:', !!window.monacoEditor);
  console.log('CSS Editor:', !!window.cssMonacoContainer);
  console.log('Main Editor:', !!window.mainEditor);
  console.log('GrapesJS Sync Setup:', !!window.grapesJSSyncSetup);
  
  if (window.monacoEditor) {
    console.log('HTML Content length:', window.monacoEditor.getValue().length);
  }
  if (window.cssMonacoContainer) {
    console.log('CSS Content length:', window.cssMonacoContainer.getValue().length);
  }
};

window.formatMonacoEditors = function() {
  formatEditors();
};

window.refreshMonacoEditors = function() {
  const mainEditor = window.mainEditor || window.editor;
  
  if (!mainEditor) {
    console.warn('GrapesJS editor not found');
    return;
  }
  
  const editorContainer = document.querySelector('#editorContainer') || 
                        document.querySelector('.editor-container');
  
  if (editorContainer) {
    initializeMonacoEditors(mainEditor, editorContainer);
  } else {
    console.warn('Editor container not found');
  }
};

export function reloadMonacoWithCDN(mainEditor, editorContainer) {
  disposeExistingEditors();
  
  const htmlContainer = editorContainer.querySelector('#htmlEditor');
  const cssContainer = editorContainer.querySelector('#cssEditor');
  const htmlImportCodeContainer = editorContainer.querySelector('#htmlImportCodeContainer');
  clearContainers(htmlContainer, cssContainer, htmlImportCodeContainer);

  if (window.require && window.require.undef) {
    window.require.undef('vs/editor/editor.main');
  }
  
  if (window.monaco) {
    initMonacoEditors(mainEditor, htmlContainer, cssContainer , htmlImportCodeContainer);
    setupEditorsLayout();
    setupDefaultContent();
    formatEditors();
  } else {
    initializeMonacoEditors(mainEditor, editorContainer);
  }
}

export function diagnoseCDNIssues() {
  if (!window.monaco || !window.monacoEditor || !window.cssMonacoContainer || !window.monaco.languages) {
    return false;
  }
  
  try {
    const htmlModel = window.monacoEditor.getModel();
    const cssModel = window.cssMonacoContainer.getModel();
    
    if (!htmlModel || !cssModel) {
      console.error('❌ Editor models not working');
      return false;
    }
    
    window.monacoEditor.focus();
    window.monacoEditor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    
    window.cssMonacoContainer.focus();
    window.cssMonacoContainer.trigger('keyboard', 'editor.action.triggerSuggest', {});
    
    return true;
  } catch (error) {
    return false;
  }
}

export function fixCDNIssues() {
  const isHealthy = diagnoseCDNIssues();
  
  if (!isHealthy && window.mainEditor) {
    const editorContainer = document.querySelector('#editorContainer') || 
                          document.querySelector('.editor-container');
    if (editorContainer) {
      reloadMonacoWithCDN(window.mainEditor, editorContainer);
    }
  }
}

window.reloadMonacoWithCDN = function() {
  if (window.mainEditor) {
    const editorContainer = document.querySelector('#editorContainer') || 
                          document.querySelector('.editor-container');
    if (editorContainer) {
      reloadMonacoWithCDN(window.mainEditor, editorContainer);
    }
  }
};

window.diagnoseCDNIssues = function() {
  return diagnoseCDNIssues();
};

window.fixCDNIssues = function() {
  fixCDNIssues();
};

window.simpleFix = function() {
  window.clearMonacoContext();
  
  const htmlContainer = document.querySelector('#htmlEditor') || document.createElement('div');
  const cssContainer = document.querySelector('#cssEditor') || document.createElement('div');
  const htmlImportCodeContainer = document.querySelector('#htmlImportCodeContainer') || document.createElement('div');
  
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

  if (!htmlImportCodeContainer.id) {
    htmlImportCodeContainer.id = 'htmlImportCodeEditor';
    htmlImportCodeContainer.style.height = '300px';
    htmlImportCodeContainer.style.border = '1px solid #ccc';
    document.body.appendChild(htmlImportCodeContainer);
  }
  
  disposeExistingEditors();
  
  const mainEditor = window.mainEditor || window.editor;
  const htmlContent = mainEditor ? mainEditor.getHtml() || '<div>Hello World</div>' : '<div>Hello World</div>';
  const cssContent = mainEditor ? mainEditor.getCss() || '' : '';
  
  if (window.monaco && window.monaco.editor) {
    window.monacoEditor = window.monaco.editor.create(htmlContainer, {
      value: htmlContent,
      language: 'html',
      ...MONACO_CONFIG.EDITOR_OPTIONS
    });
    
    window.cssMonacoContainer = window.monaco.editor.create(cssContainer, {
      value: cssContent,
      language: 'css',
      ...MONACO_CONFIG.EDITOR_OPTIONS
    });
    
    window.monacoImportCodeEditor = window.monaco.editor.create(htmlImportCodeContainer, {
      value: 'hosseintest',
      language: 'html',
      ...MONACO_CONFIG.EDITOR_OPTIONS
    });
    
    if (mainEditor) {
      setupHtmlEditorEvents(window.monacoEditor, mainEditor);
      setupCssEditorEvents(window.cssMonacoContainer, mainEditor);
      setupHtmlImportCodeEditorEvents(window.monacoEditor, mainEditor);
    }
    

  }
};

function setupCSSSuggestions() {
  updateCSSSuggestions();
}

function updateCSSSuggestions() {
  getCombinedCSSClasses().then(cssClasses => {
    if (cssClasses.length > 0 && window.monaco?.languages) {
      if (window.cssCompletionProvider) {
        window.cssCompletionProvider.dispose();
      }
      window.cssCompletionProvider = window.monaco.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: function(model, position) {
          return createSmartHtmlSuggestions(cssClasses, model, position);
        }
      });
    }
  });
}