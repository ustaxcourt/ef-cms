let concat = require('concat-stream');
let path = require('path');
let Stream = require('stream');
let streamify = require('stream-array');

let s3Files = {};
module.exports = s3Files;

s3Files.connect = function (opts) {
  let self = this;
  self.s3 = opts.s3;
  self.bucket = opts.bucket;
  return self;
};

s3Files.createKeyStream = function (folder, keys) {
  if (!keys) return null;
  let paths = [];
  keys.forEach(function (key) {
    if (folder) {
      paths.push(path.posix.join(folder, key));
    } else {
      paths.push(key);
    }
  });
  return streamify(paths);
};

s3Files.createFileStream = function (keyStream, preserveFolderPath) {
  let self = this;
  if (!self.bucket) return null;

  let rs = new Stream();
  rs.readable = true;

  let fileCounter = 0;
  keyStream.on('data', async function (file) {
    fileCounter += 1;
    if (fileCounter > 5) {
      keyStream.pause(); // we add some 'throttling' there
    }

    let params = { Bucket: self.bucket, Key: file };
    let s3File = await self.s3.getObject(params).createReadStream();

    s3File.pipe(
      concat(function buffersEmit(buffer) {
        let innerPath = preserveFolderPath
          ? file
          : file.replace(/^.*[\\/]/, '');
        rs.emit('data', { data: buffer, path: innerPath });
      }),
    );
    s3File.on('end', function () {
      fileCounter -= 1;
      if (keyStream.isPaused()) {
        keyStream.resume();
      }
      if (fileCounter < 1) {
        rs.emit('end');
      }
    });

    s3File.on('error', function (err) {
      err.file = file;
      rs.emit('error', err);
    });
  });
  return rs;
};
