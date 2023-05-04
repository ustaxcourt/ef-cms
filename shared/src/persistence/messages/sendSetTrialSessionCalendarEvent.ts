export const sendSetTrialSessionCalendarEvent = async ({
  applicationContext,
  payload,
}) => {
  const sqs = await applicationContext.getMessagingClient();

  await sqs
    .sendMessage({
      MessageBody: JSON.stringify(payload),
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
    })
    .promise();
};
