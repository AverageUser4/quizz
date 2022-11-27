export function parseHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.textContent;
}

export function shuffleArray(array) {
  const copy = [...array];
  const result = [];

  while(copy.length)
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);

  return result;
}