const createApplicationContext = require('../../../src/applicationContext');

exports.handler = async event => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketEntryId, docketNumber } = JSON.parse(body);

  applicationContext.logger.info(
    `About to process legacy document for case:${docketNumber}, docketEntryId: ${docketEntryId}`,
  );

  try {
    await applicationContext.getUseCases().parseLegacyDocumentsInteractor({
      applicationContext,
      docketEntryId,
      docketNumber,
    });
  } catch (err) {
    applicationContext.logger.error(
      `Failed processing legacy document ${docketNumber}, ${docketEntryId}: ${err.message}`,
      err,
    );

    // try again if error does not have one of the following
    if (
      !(
        err.message.includes('Docket entry document not found in S3.') ||
        err.message.includes('Docket entry not found.')
      )
    ) {
      throw err;
    }
  }

  const sqs = applicationContext.getQueueService();
  await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
