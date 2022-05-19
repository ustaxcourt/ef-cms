/* istanbul ignore file */
const archiver = require('archiver');
const s3Files = require('s3-files');

const s3Zip = {};
module.exports = s3Zip;

const noop = () => {};

s3Zip.archive = function (
  {
    bucket,
    debug = false,
    onEntry = noop,
    onError = noop,
    onProgress = noop,
    s3,
  },
  { extras, extrasZip, filesS3, filesZip, folder = '' },
) {
  let connectionConfig;

  connectionConfig = {
    s3,
  };

  connectionConfig.bucket = bucket;

  const client = s3Files.connect(connectionConfig);

  const keyStream = client.createKeyStream(folder, filesS3);

  const stream = s3Files.createFileStream(keyStream, true);

  const archive = archiver('zip', { gzip: false });

  const extrasPromises = (extras || []).map((extra, index) =>
    Promise.resolve(extra).then(file => {
      debug && console.log('append to zip from promise', extrasZip[index]);
      archive.append(file, { name: extrasZip[index] });
    }),
  );

  const extraFilesPromisesAll = Promise.all(extrasPromises).then(() => {
    debug && console.log('promise.all complete');
  });

  archive.on('error', function (err) {
    debug && console.log('archive error', err);
    onError(err);
  });

  archive.on('progress', onProgress);
  archive.on('entry', onEntry);

  stream
    .on('data', function (file) {
      if (file.path[file.path.length - 1] === '/') {
        debug && console.log("don't append to zip", file.path);
        return;
      }
      let fname;
      if (filesZip) {
        // Place files_s3[i] into the archive as files_zip[i]
        const i = filesS3.indexOf(
          file.path.startsWith(folder)
            ? file.path.substr(folder.length)
            : file.path,
        );
        fname = i >= 0 && i < filesZip.length ? filesZip[i] : file.path;
      } else {
        // Just use the S3 file name
        fname = file.path;
      }
      const entryData = typeof fname === 'object' ? fname : { name: fname };
      debug && console.log('append to zip', fname);
      if (file.data.length === 0) {
        archive.append('', entryData);
      } else {
        archive.append(file.data, entryData);
      }
    })
    .on('end', function () {
      debug && console.log('end -> finalize');
      extraFilesPromisesAll
        .then(() => {})
        .catch(() => {})
        .then(() => {
          debug && console.log('promise.all -> finalize');
          archive.finalize();
        });
    })
    .on('error', function (err) {
      archive.emit('error', err);
    });

  return archive;
};
