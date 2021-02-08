const fs = require('fs');

const either = (resolve, reject) => {
    return (error, data) => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    };
};

const createPromise = fun => {
    return new Promise((resolve, reject) => {
        fun(either(resolve, reject));
    });
};

function hasAccess(file) {
    return createPromise(cb => fs.access(file, fs.constants.R_OK | fs.constants.W_OK, cb));
}

function readFile(file) {
    return createPromise(cb => fs.readFile(file, 'utf-8', cb));
}

function replaceString(content, pattern, replacement) {
    return createPromise(cb => setImmediate(cb, null, content.replace(pattern, replacement)));
}

function writeFile(file, content) {
    return createPromise(cb => fs.writeFile(file, content, cb));
}

module.exports = { hasAccess, readFile, replaceString, writeFile };
