const stream = require('stream');
const s3Zip = require('s3-zip');
const aws = require('aws-sdk');

/**
 * runBatchProcess
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.runBatchProcess = async ({ caseId, applicationContext }) => {
  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  //get document ids
  const ids = caseToBatch.documents.map(document => document.documentId);
  const names = caseToBatch.documents.map(
    document => `${document.documentType}.pdf`,
  );

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
      Key: `${
        caseToBatch.docketNumber
      }_${caseToBatch.contactPrimary.name.replace(/\s/g, '_')}.zip`,
    };
    s3Client.upload(params, function() {});

    return pass;
  }

  s3Zip
    .setArchiverOptions({ gzip: false })
    .archive({ bucket: bucket, region: region, s3: s3Client }, '', ids, names)
    .pipe(uploadFromStream(s3Client));
};
