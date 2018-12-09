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

  const createdCase = await applicationContext
    .getPersistenceGateway()
    .createCase({
      caseRecord: new Case({
        userId: userId,
        docketNumber: docketNumber,
        documents: documents,
      })
        .validate()
        .toJSON(),
      applicationContext,
    });

  return new Case(createdCase).validate().toJSON();
};
