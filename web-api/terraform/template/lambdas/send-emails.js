const createApplicationContext = require('../../../src/applicationContext');
const {
  sendWithRetry,
} = require('../../../../shared/src/dispatchers/ses/sendBulkTemplatedEmail');

exports.handler = async event => {
  const applicationContext = createApplicationContext({});
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const params = JSON.parse(body);

  await sendWithRetry({ applicationContext, params });

  // await applicationContext
  //   .getUseCases()
  //   .generateNoticesForCaseTrialSessionCalendarInteractor(applicationContext, {
  //     docketNumber,
  //     jobId,
  //     trialSession,
  //     userId,
  //   });

  const sqs = await applicationContext.getMessagingClient();
  await sqs
    .deleteMessage({
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/send_emails_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}.fifo`,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
