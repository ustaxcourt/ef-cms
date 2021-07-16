const fs = require('fs');
const tmp = require('tmp');

const queueHasRecords = () => {};

/**
 * virusScanPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message received from SQS
 * @returns {object} errors (null if no errors)
 */
exports.virusScanPdfInteractor = async (
  applicationContext,
  { key, scanCompleteCallback },
) => {
  // get the document from the quarantine bucket
  // write actual file contents to temp directory so it can be scanned
  // try {
  //   virus scan - this will throw an error if there is a virus detected
  //   move document to clean bucket
  //   delete document from quarantine bucket
  //   delete message from the SQS queue
  // } catch (e) {
  //   do nothing - there is a virus detected (if (e.code === 1) - do we need this? what do we do if it does not return this error code?)
  // }

  // CA question - should this part go in a handler and this interactor just take in a key?
  // const { Body: body } = message;
  // const parsedBody = JSON.parse(body);

  // if (!parsedBody.Records) {
  //   await applicationContext
  //     .getMessagingClient()
  //     .deleteMessage({
  //       QueueUrl: applicationContext.environment.virusScanQueueUrl,
  //       ReceiptHandle: message.ReceiptHandle,
  //     })
  //     .promise();
  //   return;
  // }

  // const documentId = parsedBody.Records[0].s3.object.key;
  // end CA question block

  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.quarantineBucketName,
      Key: key,
    })
    .promise();

  const inputPdf = tmp.fileSync({
    mode: 0o755, // related to file permissions
    tmpdir: process.env.TMP_PATH,
  });
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  try {
    await applicationContext.runVirusScan({ filePath: inputPdf.name });

    await applicationContext
      .getStorageClient()
      .putObject({
        Body: pdfData,
        Bucket: applicationContext.environment.documentsBucketName,
        ContentType: 'application/pdf',
        Key: key,
      })
      .promise();

    await applicationContext
      .getStorageClient()
      .deleteObject({
        Bucket: applicationContext.environment.quarantineBucketName,
        Key: key,
      })
      .promise();

    await scanCompleteCallback();
  } catch (e) {
    if (e.code === 1) {
      await scanCompleteCallback();
      applicationContext.logger.info('file was infected', e);
    } else {
      applicationContext.logger.error('something else happened', e);
    }
  }
};
