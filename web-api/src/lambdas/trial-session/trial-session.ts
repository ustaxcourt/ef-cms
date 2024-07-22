import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  UnknownAuthUser,
  UserUndefinedError,
} from '@shared/business/entities/authUser/AuthUser';
import { createApplicationContext } from '../../applicationContext';

export const handler = async (event, authorizedUser: UnknownAuthUser) => {
  const applicationContext = createApplicationContext({});
  if (!authorizedUser) {
    throw new UserUndefinedError('User was not defined.');
  }

  try {
    const { Records } = event;
    const { body, receiptHandle } = Records[0];
    const { docketNumber, jobId, trialSession } = JSON.parse(body); // TODO 10417 should we be changing something coming in from an event external to this lambda?

    applicationContext.logger.info(
      `received an event to generate notices for trial session ${trialSession.trialSessionId} on case ${docketNumber} for job ${jobId}`,
      event,
    );

    await applicationContext
      .getUseCases()
      .generateNoticesForCaseTrialSessionCalendarInteractor(
        applicationContext,
        authorizedUser,
        {
          docketNumber,
          jobId,
          trialSession,
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
