const path = require('path');
const { hasAccess, readFile, replaceString, writeFile } = require('./lib/file-system-promise.js');

async function replaceStringInFile(pattern, replacement, file) {
  await hasAccess(file);
  const content = await readFile(file);
  const newContent = await replaceString(content, pattern, replacement);
  console.log(`Write ${newContent} to ${file}`);
}

const file = path.resolve(__dirname, 'text.txt');

replaceStringInFile('hej', 'hello', file)
.then(() => console.log('Great success!'))
.catch(error => console.error(error));
