export const scanMessages = ({ applicationContext, messages }) => {
  const scanCalls = messages.map(message =>
    applicationContext
      .getUseCases()
      .virusScanPdfInteractor(applicationContext, {
        key: applicationContext
          .getPersistenceGateway()
          .getDocumentIdFromSQSMessage(message),
        scanCompleteCallback: applicationContext
          .getPersistenceGateway()
          .deleteMessage({
            applicationContext,
            message,
            queueUrl: applicationContext.environment.virusScanQueueUrl,
          }),
      }),
  );

  return Promise.all(scanCalls);
};
