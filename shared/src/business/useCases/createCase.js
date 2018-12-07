const Case = require('../entities/Case');

/**
 * createCase
 *
 * @param userId
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createCase = async ({ userId, documents, applicationContext }) => {
  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );
  const caseToCreate = new Case({
    userId: userId,
    docketNumber: docketNumber,
    documents: documents,
  });
  caseToCreate.validate();

  return applicationContext.getPersistenceGateway().createCase({
    caseRecord: { ...caseToCreate },
    applicationContext,
  });
};
