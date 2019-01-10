const Case = require('../entities/Case');
const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * createCase
 *
 * @param petition
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createCase = async ({ petition, documents, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user.userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  documents.forEach(document => {
    document.userId = user.userId;
    document.filedBy = `Petitioner ${user.name}`;
  });

  const createdCase = await applicationContext
    .getPersistenceGateway()
    .createCase({
      caseRecord: new Case({
        userId: user.userId,
        ...petition,
        petitioners: [
          {
            ...user.toRawObject(),
          },
        ],
        docketNumber,
        documents,
        caseTitle: `${
          user.name
        }, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`,
      })
        .validate()
        .toRawObject(),
      applicationContext,
    });

  return new Case(createdCase).validate().toRawObject();
};
