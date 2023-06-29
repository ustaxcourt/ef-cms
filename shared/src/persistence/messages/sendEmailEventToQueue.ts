export const sendEmailEventToQueue = async ({
  applicationContext,
  emailParams,
}) => {
  const concurrencyLimit =
    applicationContext.getConstants().SES_CONCURRENCY_LIMIT;

  const sqs = await applicationContext.getMessagingClient();

  await sqs
    .sendMessage({
      MessageBody: JSON.stringify(emailParams),
      MessageGroupId: `${parseInt(Math.random() * concurrencyLimit)}`,
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/send_emails_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}.fifo`,
    })
    .promise();
};
