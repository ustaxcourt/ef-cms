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
  onProgress,
  onUploadStart,
  s3Ids,
  uploadToTempBucket,
  zipName,
}) => {
  return new Promise((resolve, reject) => {
    const { region } = applicationContext.environment;
    const documentsBucket = applicationContext.environment.documentsBucketName;
    const destinationBucket = uploadToTempBucket
      ? applicationContext.environment.tempDocumentsBucketName
      : applicationContext.environment.documentsBucketName;

    const s3Client = applicationContext.getStorageClient();

    const uploadFromStream = s3Client => {
      if (onUploadStart) onUploadStart();

      const pass = new stream.PassThrough();

      const params = {
        Body: pass,
        Bucket: destinationBucket,
        Key: zipName,
      };
      s3Client.upload(params, function() {
        resolve();
      });

      pass.on('error', reject);

      return pass;
    };

    s3Zip
      .setArchiverOptions({ gzip: false })
      .archive(
        {
          bucket: documentsBucket,
          debug: true,
          onEntry,
          onProgress,
          region,
          s3: s3Client,
        },
        '',
        s3Ids,
        fileNames,
        extraFiles,
        extraFileNames,
      )
      .pipe(uploadFromStream(s3Client));
  });
};
