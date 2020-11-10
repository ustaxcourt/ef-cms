const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });
const {
  parseLegacyDocumentsInteractor,
} = require('../../../../shared/src/business/useCases/migration/parseLegacyDocumentsInteractor');

// TODO - add everything we need for parseLegacyDocumentsInteractor to this applicationContext
const applicationContext = {
  getUseCases: () => ({
    parseLegacyDocumentsInteractor,
  }),
};

exports.applicationContext = applicationContext;

exports.handler = async event => {
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

  await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
