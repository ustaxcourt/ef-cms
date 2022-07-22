exports.sendToCalendarSessionQueue = async ({
  applicationContext,
  docketNumber,
  jobId,
  trialSession,
  userId,
}) => {
  const sqs = await applicationContext.getMessagingClient();

  await sqs
    .sendMessage({
      MessageBody: JSON.stringify({
        docketNumber,
        jobId,
        trialSession,
        userId,
      }),
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/calendar_trial_session_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
    })
    .promise();
};
