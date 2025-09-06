// export function tryAutoRenameHtmlTag(event, editor) {
//   try {
//     if (!event || !event.changes || event.changes.length !== 1) return;
//     const change = event.changes[0];
//     const prevValue = typeof window._htmlPrevValue === 'string' ? window._htmlPrevValue : '';
//     const currentValue = editor.getValue();
//     if (!prevValue || !currentValue) return;

//     const rangeOffset = typeof change.rangeOffset === 'number' ? change.rangeOffset : null;
//     if (rangeOffset === null) return;

//     const delta = (change.text || '').length - (change.rangeLength || 0);
//     const newOffset = rangeOffset + delta;

//     const prevOpenIdx = prevValue.lastIndexOf('<', rangeOffset);
//     const prevCloseIdx = prevValue.indexOf('>', rangeOffset);
//     if (prevOpenIdx === -1 || prevCloseIdx === -1) return;
//     const prevSegment = prevValue.slice(prevOpenIdx, prevCloseIdx + 1);
//     const prevIsClosing = prevSegment.startsWith('</');
//     const prevNameMatch = prevIsClosing
//       ? prevSegment.match(/^<\/\s*([a-zA-Z][\w\-]*)/)
//       : prevSegment.match(/^<\s*([a-zA-Z][\w\-]*)/);
//     if (!prevNameMatch) return;
//     const prevTagName = prevNameMatch[1];

//     const currOpenIdx = currentValue.lastIndexOf('<', Math.max(0, newOffset));
//     const currCloseIdx = currentValue.indexOf('>', Math.max(0, newOffset));
//     if (currOpenIdx === -1 || currCloseIdx === -1) return;
//     const currSegment = currentValue.slice(currOpenIdx, currCloseIdx + 1);
//     const currIsClosing = currSegment.startsWith('</');
//     const currNameMatch = currIsClosing
//       ? currSegment.match(/^<\/\s*([a-zA-Z][\w\-]*)/)
//       : currSegment.match(/^<\s*([a-zA-Z][\w\-]*)/);
//     if (!currNameMatch) return;
//     const currTagName = currNameMatch[1];

//     if (currTagName === prevTagName) return;

//     const model = editor.getModel();
//     if (!model) return;

//     if (!currIsClosing) {
//       const closingIdx = findMatchingClosingTagIndexGeneric(currentValue, currCloseIdx + 1, prevTagName);
//       if (closingIdx != null) {
//         const nameStartAbs = closingIdx + 2; // after '</'
//         const nameEndAbs = nameStartAbs + prevTagName.length;
//         const startPos = model.getPositionAt(nameStartAbs);
//         const endPos = model.getPositionAt(nameEndAbs);
//         window.isAutoRenamingTag = true;
//         editor.executeEdits('auto-rename-tag', [{
//           range: {
//             startLineNumber: startPos.lineNumber,
//             startColumn: startPos.column,
//             endLineNumber: endPos.lineNumber,
//             endColumn: endPos.column
//           },
//           text: currTagName
//         }]);
//         window.isAutoRenamingTag = false;
//       }
//     } else {
//       const openingIdx = findMatchingOpeningTagIndexGeneric(currentValue, currOpenIdx, prevTagName);
//       if (openingIdx != null) {
//         const nameStartAbs = openingIdx + 1; // after '<'
//         const nameEndAbs = nameStartAbs + prevTagName.length;
//         const startPos = model.getPositionAt(nameStartAbs);
//         const endPos = model.getPositionAt(nameEndAbs);
//         window.isAutoRenamingTag = true;
//         editor.executeEdits('auto-rename-tag', [{
//           range: {
//             startLineNumber: startPos.lineNumber,
//             startColumn: startPos.column,
//             endLineNumber: endPos.lineNumber,
//             endColumn: endPos.column
//           },
//           text: currTagName
//         }]);
//         window.isAutoRenamingTag = false;
//       }
//     }
//   } catch (err) {
//     // silent fail
//   }
// }

// export function findMatchingClosingTagIndexGeneric(text, searchFromIdx, targetName) {
//   try {
//     const tagRegex = /<\/?[a-zA-Z][\w\-]*(?:\s[^<>]*?)?>/g;
//     tagRegex.lastIndex = searchFromIdx;
//     const stack = [];
//     while (true) {
//       const m = tagRegex.exec(text);
//       if (!m) return null;
//       const token = m[0];
//       const idx = m.index;
//       const isClosing = token.startsWith('</');
//       const nameMatch = token.match(isClosing ? /^<\/\s*([a-zA-Z][\w\-]*)/ : /^<\s*([a-zA-Z][\w\-]*)/);
//       if (!nameMatch) continue;
//       const name = nameMatch[1];
//       const isSelfClosing = /\/\s*>$/.test(token) || isVoidElement(name);

//       if (!isClosing) {
//         if (!isSelfClosing) stack.push(name);
//       } else {
//         if (stack.length > 0) {
//           if (stack[stack.length - 1] === name) {
//             stack.pop();
//           }
//         } else if (name === targetName) {
//           return idx;
//         }
//       }
//     }
//   } catch (e) {
//     return null;
//   }
// }

// export function findMatchingOpeningTagIndexGeneric(text, closingStartIdx, targetName) {
//   try {
//     const tagRegex = /<\/?[a-zA-Z][\w\-]*(?:\s[^<>]*?)?>/g;
//     const stack = [];
//     let m;
//     while ((m = tagRegex.exec(text))) {
//       const token = m[0];
//       const idx = m.index;
//       if (idx > closingStartIdx) break;
//       const isClosing = token.startsWith('</');
//       const nameMatch = token.match(isClosing ? /^<\/\s*([a-zA-Z][\w\-]*)/ : /^<\s*([a-zA-Z][\w\-]*)/);
//       if (!nameMatch) continue;
//       const name = nameMatch[1];
//       const isSelfClosing = /\/\s*>$/.test(token) || isVoidElement(name);

//       if (!isClosing) {
//         if (!isSelfClosing) stack.push({ name, idx });
//       } else {
//         if (idx === closingStartIdx && name === targetName) {
//           const top = stack[stack.length - 1];
//           if (top && top.name === targetName) return top.idx;
//           return null;
//         }
//         if (stack.length > 0 && stack[stack.length - 1].name === name) {
//           stack.pop();
//         }
//       }
//     }
//     return null;
//   } catch (e) {
//     return null;
//   }
// }

// export function isVoidElement(name) {
//   const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
//   return voids.has(String(name).toLowerCase());
// }