import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { applicationContext } from '@web-api/applicationContext';

export const handler = async event => {
  if (process.env.READ_ONLY_MODE === 'true') {
    applicationContext.logger.info(
      'Skipping trial-session handler due to read-only mode.',
    );
    throw new Error('System is in read-only mode.');
  }

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

    const sqs: SQSClient = await applicationContext.getMessagingClient();
    const cmd = new DeleteMessageCommand({
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
      ReceiptHandle: receiptHandle,
    });
    await sqs.send(cmd);
  } catch (err) {
    applicationContext.logger.error(err);
    throw err;
  }
};
