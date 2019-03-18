const stream = require('stream');
const s3Zip = require('s3-zip');
const aws = require('aws-sdk');

/**
 * zipS3Documents
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.zipS3Documents = ({
  s3Ids,
  fileNames,
  zipName,
  applicationContext,
}) => {
  return new Promise((resolve, reject) => {
    const region = applicationContext.environment.region;
    const bucket = applicationContext.environment.documentsBucketName;

    const s3Client = new aws.S3({
      endpoint: applicationContext.environment.s3Endpoint,
      s3ForcePathStyle: 'true',
      signatureVersion: 'v4',
    });

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
