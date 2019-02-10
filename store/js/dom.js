'use strict';

function createElement(block) {

  if (Array.isArray(block)) {
    return block.reduce((fgmnt, lmnt) => {
      fgmnt.appendChild(createElement(lmnt));
      return fgmnt;
    }, document.createDocumentFragment());
  }

  if ((typeof block === 'string') || (typeof block === 'number')) {
    return document.createTextNode(block.toString());
  }

  const element = document.createElement(block.name);

  if (block.props) {
    Object.keys(block.props).forEach(
      key => {
        element.setAttribute(key, block.props[key])
      }
    );
  }

  if (block.childs) {
    element.appendChild(createElement(block.childs));
  }

  return element;
}
