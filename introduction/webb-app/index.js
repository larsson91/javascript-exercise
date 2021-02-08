const input = document.querySelector('#name-input');
const button = document.querySelector('button');
const nameParagraph = document.querySelector('#name-paragraph');

button.addEventListener('click', event => {
  console.log(input.value);
  // Update nameParagraph with `input.value`
});
