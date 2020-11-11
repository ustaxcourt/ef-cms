const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: 'us-east-1' });

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketEntryId, docketNumber } = JSON.parse(body);

  console.log(
    `About to process legacy document for case:${docketNumber}, docketEntryId: ${docketEntryId}`,
  );

  await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();

  // await applicationContext.getUseCases().saveLegacyDocumentsForMigratedCaseInteractor({
  //   applicationContext,
  //   docketEntryId,
  //   docketNumber
  // });

  //read docket entry id and docket number from message
  //get document from s3
  //get case from dynamo
  //parse text from pdf
  //create new s3 entry for documentcontentsid
  //update case entity docket entry with document contents id
  //call update case
};
