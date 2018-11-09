'use strict';

var path = require('path'),
    rmdir = require('rmdir'),
    fs = require('fs');

var absPath = function (p) {
  if (path.isAbsolute(p)) {
    return p;
  } else {
    return path.join(path.dirname(__filename), p);
  }
};

var removeDir = function (relPath, callback) {
    var path = absPath(relPath);
    rmdir(path, callback);
};

var createDir = function (relPath) {
    if (!fs.existsSync(absPath(relPath))) {
        fs.mkdirSync(absPath(relPath));
    }
};

module.exports = {
    absPath: absPath,
    removeDir: removeDir,
    createDir: createDir
};
