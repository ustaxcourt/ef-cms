import { createApplicationContext } from '../../applicationContext';

export const handler = async event => {
  const applicationContext = createApplicationContext({});
  try {
    const { Records } = event;
    const { body, receiptHandle } = Records[0];
    const { docketNumber, jobId, trialSession, userId } = JSON.parse(body);

    applicationContext.logger.info(
      `received an event to generate notices for trial session ${trialSession.trialSessionId} on case ${docketNumber} for job ${jobId}`,
      event,
    );

    await applicationContext
      .getUseCases()
      .generateNoticesForCaseTrialSessionCalendarInteractor(
        applicationContext,
        {
          docketNumber,
          jobId,
          trialSession,
          userId,
        },
      );

    applicationContext.logger.info(
      `finished processing the event to generate notices for trial session ${trialSession.trialSessionId} on case ${docketNumber} for job ${jobId}`,
      event,
    );

    const sqs = await applicationContext.getMessagingClient();
    await sqs
      .deleteMessage({
        QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
        ReceiptHandle: receiptHandle,
      })
      .promise();
  } catch (err) {
    applicationContext.logger.error(err);
    throw err;
  }
};
