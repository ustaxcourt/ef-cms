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
  // TODO: function should be named "createCase", case should be raw
  return applicationContext.persistence.createCase({
    caseRecord: caseToCreate,
    applicationContext,
  });
};
