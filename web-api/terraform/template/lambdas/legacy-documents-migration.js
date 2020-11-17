const createApplicationContext = require('../../../src/applicationContext');

exports.handler = async event => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketEntryId, docketNumber } = JSON.parse(body);

  applicationContext.logger.info(
    `About to process legacy document for case:${docketNumber}, docketEntryId: ${docketEntryId}`,
  );

  await applicationContext.getUseCases().parseLegacyDocumentsInteractor({
    applicationContext,
    docketEntryId,
    docketNumber,
  });

  const sqs = applicationContext.getQueueService();
  await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
