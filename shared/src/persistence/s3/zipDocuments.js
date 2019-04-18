const s3Zip = require('s3-zip');
const stream = require('stream');

/**
 * zipDocuments
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.zipDocuments = ({ s3Ids, fileNames, zipName, applicationContext }) => {
  return new Promise((resolve, reject) => {
    const region = applicationContext.environment.region;
    const bucket = applicationContext.environment.documentsBucketName;

    const s3Client = applicationContext.getStorageClient();

    function uploadFromStream(s3Client) {
      const pass = new stream.PassThrough();

      const params = {
        Body: pass,
        Bucket: bucket,
        Key: zipName,
      };
      s3Client.upload(params, function() {});

      pass.on('finish', () => {
        resolve();
      });

      pass.on('error', reject);

      return pass;
    }

    s3Zip
      .setArchiverOptions({ gzip: false })
      .archive(
        { bucket: bucket, region: region, s3: s3Client },
        '',
        s3Ids,
        fileNames,
      )
      .pipe(uploadFromStream(s3Client));
  });
};
