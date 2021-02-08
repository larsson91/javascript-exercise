const path = require('path');
const { hasAccess, readFile, replaceString, writeFile } = require('./lib/file-system-promise.js');

function replaceStringInFile(pattern, replacement, file) {
  return hasAccess(file)
  .then(() => readFile(file))
  .then(content => replaceString(content, pattern, replacement))
  .then(newContent => console.log(`Write ${newContent} to ${file}`));
}

const file = path.resolve(__dirname, 'text.txt');

replaceStringInFile('hej', 'hello', file)
.then(() => console.log('Great success!'))
.catch(error => console.error(error));
