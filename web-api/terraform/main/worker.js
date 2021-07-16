const createApplicationContext = require('../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const getMessages = async ({ applicationContextWhat }) => {
  return await applicationContext
    .getMessagingClient()
    .getMessages({ applicationContext: applicationContextWhat });
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

const scanMessages = async ({ applicationContextWhat, messages }) => {
  const scanCalls = [];
  messages.map(message => {
    scanCalls.push(
      applicationContextWhat
        .getUseCases()
        .virusScanPdfInteractor(applicationContextWhat, {
          key: message.s3.object.key,
          scanCompleteCallback: getScanCompleteCallback({
            applicationContextWhat,
            message,
          }),
        }),
    );
  });
};

const main = async () => {
  // TODO: use the applicationContext to call a use case to scan the PDF
  setTimeout(function () {
    console.log('hello world');
  }, 10 * 1000);

  const messages = await getMessages({
    applicationContextWhat: applicationContext,
  });
};

main();
