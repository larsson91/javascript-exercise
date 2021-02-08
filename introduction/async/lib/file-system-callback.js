const fs = require('fs');

function hasAccess(file, cb) {
    fs.access(file, fs.constants.R_OK | fs.constants.W_OK, cb);
}

function readFile(file, cb) {
    fs.readFile(file, 'utf-8', cb);
}

function replaceString(content, pattern, replacement, cb) {
    setImmediate(cb, null, content.replace(pattern, replacement));
}

function writeFile(file, content, cb) {
    fs.writeFile(file, content, cb);
}

module.exports = { hasAccess, readFile, replaceString, writeFile };

