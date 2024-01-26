import {
  MESSAGE_TYPES,
  WorkerMessage,
} from 'web-api/terraform/template/lambdas/cognito-triggers';
import { SQS } from 'aws-sdk';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const sendUpdatePendingEmailMessage = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: UserRecord },
): Promise<void> => {
  const message: WorkerMessage = {
    payload: user,
    type: MESSAGE_TYPES.UPDATE_PENDING_EMAIL,
  };
  const sqs: SQS = applicationContext.getMessagingClient();
  const queueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/update_petitioner_cases_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`;
  await sqs
    .sendMessage({
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    })
    .promise();

  applicationContext.logger.info(
    'Message sent to process pending email update',
    {
      user,
    },
  );
};
