import {
  MESSAGE_TYPES,
  WorkerMessage,
} from 'web-api/terraform/template/lambdas/cognito-triggers';

export const sendUpdatePetitionerCasesMessage = async ({
  applicationContext,
  user,
}) => {
  const sqs = await applicationContext.getMessagingClient();
  const address = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/update_petitioner_cases_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`;
  const workerMessage: WorkerMessage = {
    payload: user,
    type: MESSAGE_TYPES.UPDATE_PETITIONER_CASES,
  };
  const result = await sqs
    .sendMessage({
      MessageBody: JSON.stringify(workerMessage),
      QueueUrl: address,
    })
    .promise();

  applicationContext.logger.info('sendUpdatePetitionerCasesMessage out', {
    address,
    result,
    user,
  });

  return result;
};
