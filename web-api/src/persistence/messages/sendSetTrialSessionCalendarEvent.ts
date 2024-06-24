import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const sendSetTrialSessionCalendarEvent = async ({
  applicationContext,
  payload,
}: {
  applicationContext: ServerApplicationContext;
  payload: any;
}) => {
  const sqs: SQSClient = await applicationContext.getMessagingClient();
  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(payload),
    QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
  });

  await sqs.send(cmd);
};
