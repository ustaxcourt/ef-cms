export const sendUpdatePetitionerCasesMessage = async ({
  applicationContext,
  user,
}) => {
  const sqs = await applicationContext.getMessagingClient();
  const address = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/update_petitioner_cases_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`;
  const result = await sqs
    .sendMessage({ MessageBody: JSON.stringify(user), QueueUrl: address })
    .promise();

  applicationContext.logger.info('sendUpdatePetitionerCasesMessage', {
    address,
    result,
    user,
  });

  return result;
};
