export const deleteMessage = ({
  applicationContext,
  message,
  queueUrl,
}: {
  applicationContext: IApplicationContext;
  message: any;
  queueUrl: string;
}) =>
  applicationContext
    .getMessagingClient()
    .deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    })
    .promise();
