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
  s3Ids,
  zipName,
}) => {
  return new Promise((resolve, reject) => {
    const { region } = applicationContext.environment;
    const bucket = applicationContext.environment.documentsBucketName;

    const s3Client = applicationContext.getStorageClient();

    const uploadFromStream = s3Client => {
      const pass = new stream.PassThrough();

      const params = {
        Body: pass,
        Bucket: bucket,
        Key: zipName,
      };
      s3Client.upload(params, function() {});

      pass.on('finish', () => {
        // eslint-disable-next-line no-console
        console.log(`'${zipName}' in '${bucket}' has been created`);
        resolve();
      });

      pass.on('error', reject);

      return pass;
    };

    s3Zip
      .setArchiverOptions({ gzip: false })
      .archive(
        { bucket: bucket, debug: true, region: region, s3: s3Client },
        '',
        s3Ids,
        fileNames,
        extraFiles,
        extraFileNames,
      )
      .pipe(uploadFromStream(s3Client));
  });
};
