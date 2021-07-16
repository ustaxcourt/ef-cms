const createApplicationContext = require('../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const getMessages = async ({ appContext }) => {
  return await applicationContext
    .getMessagingClient()
    .getMessages({ applicationContext: appContext });
};

const getDocumentIdFromSQSMessage = message => {
  const { Body: body } = message;
  const parsedBody = JSON.parse(body);
  const documentId = parsedBody.Records[0].s3.object.key;
  return documentId;
};

const getScanCompleteCallback = async ({ applicationContextWhat, message }) => {
  return await applicationContextWhat
    .getMessagingClient()
    .deleteMessage({
      QueueUrl: applicationContextWhat.environment.virusScanQueueUrl,
      ReceiptHandle: message.ReceiptHandle,
    })
    .promise();
};

const scanMessages = ({ appContext, messages }) => {
  const scanCalls = messages.map(message =>
    appContext.getUseCases().virusScanPdfInteractor(appContext, {
      key: getDocumentIdFromSQSMessage(message),
      scanCompleteCallback: getScanCompleteCallback({
        appContext,
        message,
      }),
    }),
  );

  return Promise.all(scanCalls);
};

const main = () => {
  setTimeout(async function () {
    const messages = await getMessages({
      appContext: applicationContext,
    });
    await scanMessages({ appContext: applicationContext, messages });
  }, 10 * 1000);
};

main();
