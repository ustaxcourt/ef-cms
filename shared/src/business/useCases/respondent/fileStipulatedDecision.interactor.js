exports.fileStipulatedDecision = async ({ document, applicationContext }) => {
  return await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    document,
  });
};
