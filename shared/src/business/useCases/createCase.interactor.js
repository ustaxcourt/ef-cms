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

  const user = await applicationContext.getUseCases().getUser(userId);

  documents.forEach(document => {
    document.userId = userId;
  }); //initial case creation does not set the userid on each document

  const createdCase = await applicationContext
    .getPersistenceGateway()
    .createCase({
      caseRecord: new Case({
        userId,
        petitioners: [
          {
            ...user,
          },
        ],
        docketNumber,
        documents,
      })
        .validate()
        .toJSON(),
      applicationContext,
    });

  return new Case(createdCase).validate().toJSON();
};
