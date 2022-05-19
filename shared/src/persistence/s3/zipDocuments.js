const s3Zip = require('./s3-zip');
const stream = require('stream');
/**
 * zipDocuments
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.fileNames the names of the files to zip
 * @param {Array} providers.s3Ids the s3 ids of the files to zip
 * @param {string} providers.zipName the name of the generated zip file
 * @returns {Promise} the created zip
 */
exports.zipDocuments = ({
  applicationContext,
  extraFileNames,
  extraFiles,
  fileNames,
  onEntry,
  onError,
  onProgress,
  onUploadStart,
  s3Ids,
  zipName,
}) => {
  return new Promise((resolve, reject) => {
    const { documentsBucketName, tempDocumentsBucketName } =
      applicationContext.environment;

    const s3Client = applicationContext.getStorageClient();

    onUploadStart?.();

    const passThrough = new stream.PassThrough();

    s3Client.upload(
      {
        Body: passThrough,
        Bucket: tempDocumentsBucketName,
        Key: zipName,
      },
      () => resolve(),
    );

    passThrough.on('error', reject);

    s3Zip
      .archive(
        {
          bucket: documentsBucketName,
          onEntry,
          onError,
          onProgress,
          s3: s3Client,
        },
        {
          extras: extraFiles,
          extrasZip: extraFileNames,
          filesS3: s3Ids,
          filesZip: fileNames,
        },
      )
      .pipe(passThrough);
  });
};
