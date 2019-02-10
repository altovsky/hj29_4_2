'use strict';

function showComments(list) {
  const commentsContainer = document.querySelector('.comments'),
    comments = list.map(createComment),
    fragment = comments.reduce((frgmnt, lmnt) => {
      frgmnt.appendChild(lmnt);
      return frgmnt;
    }, document.createDocumentFragment());

  commentsContainer.appendChild(fragment);
  commentsContainer.style.whiteSpace = 'pre-line';
}

function createComment(comment) {
  function createElement(tagName, attributes, children) {
    const element = document.createElement(tagName);

    if (typeof attributes === 'object') {
      Object.keys(attributes).forEach(lmnt => element.setAttribute(lmnt, attributes[lmnt]));
    }

    if (typeof children === 'string' || typeof children === 'number') {
      element.textContent = children;
    } else if (children instanceof Array) {
      children.forEach(lmnt => element.appendChild(lmnt));
    }

    return element;
  }

  return createElement('div', { class: 'comment-wrap' }, [
    createElement('div', { class: 'photo', title: comment.author.name }, [
      createElement('div', { class: 'avatar', style: `background-image: url(${comment.author.pic})` })
    ]),
    createElement('div', { class: 'comment-block' }, [
      createElement('p', { class: 'comment-text' }, `${comment.text}`),
      createElement('div', { class: 'bottom-comment' }, [
        createElement('div', { class: 'comment-date' }, `${new Date(comment.date).toLocaleString('ru-Ru')}`), ///
        createElement('ul', { class: 'comment-actions' }, [
          createElement('li', { class: 'complain' }, `Пожаловаться`),
          createElement('li', { class: 'reply' }, `Ответить`)
        ])
      ])
    ])
  ]);
}

fetch('https://neto-api.herokuapp.com/comments')
  .then(res => res.json())
  .then(showComments);
