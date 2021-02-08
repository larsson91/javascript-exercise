const path = require('path');
const { hasAccess, readFile, replaceString, writeFile } = require('./lib/file-system-callback.js');

function replaceStringInFile(pattern, replacement, file, callback) {
  hasAccess(file, error => {
    if (error) {
      callback(error);
    } else {
      readFile(file, (error, content) => {
        if (error) {
          callback(error);
        } else {
          replaceString(content, pattern, replacement, (error, newContent) => {
            console.log(`Write ${newContent} to ${file}`);
            // Use the function `writeFile` which have the same signature as
            // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
            callback(null);
          });
        }
      });
    }
  });
}

const file = path.resolve(__dirname, 'text.txt');

replaceStringInFile('hej', 'hello', file, error => {
  if (error) {
    throw new Error(error);
  }
  console.log('Great success!');
});
