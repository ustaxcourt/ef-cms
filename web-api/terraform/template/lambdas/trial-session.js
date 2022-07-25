const createApplicationContext = require('../../../src/applicationContext');

exports.handler = async event => {
  const applicationContext = createApplicationContext({});
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { docketNumber, jobId, trialSession, userId } = JSON.parse(body);

  await applicationContext
    .getUseCases()
    .generateNoticesForCaseTrialSessionCalendarInteractor(applicationContext, {
      docketNumber,
      jobId,
      trialSession,
      userId,
    });

  const sqs = await applicationContext.getMessagingClient();
  await sqs
    .deleteMessage({
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
