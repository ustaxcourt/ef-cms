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

  documents.forEach(document => {
    if (!document.userId) {
      document.userId = userId;
    }
  }); //initial case creation does not set the userid on each document

  const createdCase = await applicationContext
    .getPersistenceGateway()
    .createCase({
      caseRecord: new Case({
        userId,
        docketNumber,
        documents,
      })
        .validate()
        .toJSON(),
      applicationContext,
    });

  return new Case(createdCase).validate().toJSON();
};
