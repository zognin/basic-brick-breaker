function getNextPos(curr, change) {
    return curr + change;
}

function hideElement(element) {
    element.style.display = 'none';
}

function showInlineBlockElement(element) {
    element.style.display = 'inline-block';
}

function showBlockElement(element) {
    element.style.display = 'block';
}

export { getNextPos, hideElement, showInlineBlockElement, showBlockElement };
