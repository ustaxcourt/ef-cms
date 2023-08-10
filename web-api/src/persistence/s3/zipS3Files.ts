/* istanbul ignore file */

const noop = () => {};

export const zipS3Files = ({
  additionalFileNames = [],
  additionalFiles = [],
  archiver,
  bucket,
  debug = false,
  folder = '',
  onEntry = noop,
  onError = () => {},
  onProgress = noop,
  s3Client,
  s3FilesLib,
  s3Keys,
  s3KeysFileNames,
}: {
  archiver: any;
  s3FilesLib: any;
  bucket: string;
  debug?: boolean;
  onEntry: (entryData: any) => void;
  onError: (err: any) => void;
  onProgress: (progressData: any) => void;
  s3Client: any;
  additionalFiles: string[];
  additionalFileNames: string[];
  s3Keys: string[];
  s3KeysFileNames: string[];
  folder?: string;
}) => {
  const client = s3FilesLib.connect({
    bucket,
    s3: s3Client,
  });
  const keyStream = client.createKeyStream(folder, s3Keys);
  const stream = s3FilesLib.createFileStream(keyStream, true);
  const archive = archiver('zip', { gzip: false });

  const extrasPromises = additionalFiles.map((extraFile, index) =>
    Promise.resolve(extraFile).then(file => {
      debug &&
        console.log('append to zip from promise', additionalFileNames[index]);
      archive.append(file, { name: additionalFileNames[index] });
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
      if (file.path.endsWith('/')) {
        debug && console.log("don't append to zip", file.path);
        return;
      }

      let fileName = file.path;
      if (s3KeysFileNames) {
        const fileNameIndex = s3Keys.indexOf(
          file.path.startsWith(folder)
            ? file.path.substr(folder.length)
            : file.path,
        );
        fileName =
          fileNameIndex === -1 ? file.path : s3KeysFileNames[fileNameIndex];
      }

      const entryData =
        typeof fileName === 'object' ? fileName : { name: fileName };
      debug && console.log('append to zip', fileName);
      archive.append(file.data.length === 0 ? '' : file.data, entryData);
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
