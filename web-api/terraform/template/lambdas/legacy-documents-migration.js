const createApplicationContext = require('../../../src/applicationContext');

//5785083d-facd-430f-8b2f-f858c53acc6e

exports.handler = async event => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketEntryId, docketNumber } = JSON.parse(body);

  console.log(
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
