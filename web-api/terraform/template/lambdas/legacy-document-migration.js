exports.processItems = processItems;

exports.handler = async event => {
    const { Records } = event;
    const { body, receiptHandle } = Records[0];
    const { docketEntryId, docketNumber}  = JSON.parse(body);
  
    console.log(`about to process ${docketEntryId} of ${docketNumber}`);

    // await applicationContext.getUseCases().saveLegacyDocumentsForMigratedCaseInteractor({
    //   applicationContext,
    //   docketEntryId, 
    //   docketNumber
    // });

    await sqs
    .deleteMessage({
      QueueUrl: process.env.MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
//read docket entry id and docket number from message
//get document from s3
//get case from dynamo
//parse text from pdf 
//create new s3 entry for documentcontentsid
//update case entity docket entry with document contents id
//call update case
};
