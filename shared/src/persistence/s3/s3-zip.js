/* istanbul ignore file */
const archiver = require('archiver');
const s3Files = require('s3-files');

const s3Zip = {};
module.exports = s3Zip;

s3Zip.archive = function (opts, folder, filesS3, filesZip, extra, extraZip) {
  const thisArchive = this;
  let connectionConfig;

  this.folder = folder;

  const noop = () => {};
  thisArchive.debug = opts.debug || false;
  thisArchive.onEntry = opts.onEntry || noop;
  thisArchive.onProgress = opts.onProgress || noop;
  thisArchive.onError = opts.onError || noop;

  if ('s3' in opts) {
    connectionConfig = {
      s3: opts.s3,
    };
  } else {
    connectionConfig = {
      region: opts.region,
    };
  }

  connectionConfig.bucket = opts.bucket;

  thisArchive.client = s3Files.connect(connectionConfig);

  const keyStream = thisArchive.client.createKeyStream(folder, filesS3);

  const preserveFolderStructure =
    opts.preserveFolderStructure === true || filesZip;
  const fileStream = s3Files.createFileStream(
    keyStream,
    preserveFolderStructure,
  );
  const archive = thisArchive.archiveStream(
    fileStream,
    filesS3,
    filesZip,
    extra,
    extraZip,
  );

  return archive;
};

s3Zip.archiveStream = function (stream, filesS3, filesZip, extras, extrasZip) {
  const thisArchive = this;
  const folder = this.folder || '';
  if (this.registerFormat) {
    archiver.registerFormat(this.registerFormat, this.formatModule);
  }
  const archive = archiver(this.format || 'zip', this.archiverOpts || {});

  const extrasPromises = (extras || []).map((extra, index) =>
    Promise.resolve(extra).then(file => {
      thisArchive.debug &&
        console.log('append to zip from promise', extrasZip[index]);
      archive.append(file, { name: extrasZip[index] });
    }),
  );

  const extraFilesPromisesAll = Promise.all(extrasPromises).then(() => {
    thisArchive.debug && console.log('promise.all complete');
  });

  archive.on('error', function (err) {
    console.log('archive error', err);
    thisArchive.onError(err);
  });

  archive.on('progress', thisArchive.onProgress);
  archive.on('entry', thisArchive.onEntry);

  stream
    .on('data', function (file) {
      if (file.path[file.path.length - 1] === '/') {
        thisArchive.debug && console.log("don't append to zip", file.path);
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
      thisArchive.debug && console.log('append to zip', fname);
      if (file.data.length === 0) {
        archive.append('', entryData);
      } else {
        archive.append(file.data, entryData);
      }
    })
    .on('end', function () {
      thisArchive.debug && console.log('end -> finalize');
      extraFilesPromisesAll
        .then(() => {})
        .catch(() => {})
        .then(() => {
          thisArchive.debug && console.log('promise.all -> finalize');
          archive.finalize();
        });
    })
    .on('error', function (err) {
      archive.emit('error', err);
    });

  return archive;
};

s3Zip.setFormat = function (format) {
  this.format = format;
  return this;
};

s3Zip.setArchiverOptions = function (archiverOpts) {
  this.archiverOpts = archiverOpts;
  return this;
};

s3Zip.setRegisterFormatOptions = function (registerFormat, formatModule) {
  this.registerFormat = registerFormat;
  this.formatModule = formatModule;
  return this;
};
