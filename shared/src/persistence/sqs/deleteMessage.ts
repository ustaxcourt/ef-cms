exports.deleteMessage = ({ applicationContext, message, queueUrl }) =>
  applicationContext
    .getMessagingClient()
    .deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    })
    .promise();
