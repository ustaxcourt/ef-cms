const Case = require('../entities/Case');
const Petition = require('../entities/Case');

/**
 * createCase
 *
 * @param userId
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createCase = async ({ petition, documents, applicationContext }) => {
  // TODO: add auth
  // TODO: make lambdas getCurrentUser match UI
  const petitionEntity = new (applicationContext.getEntityConstructors()).Petition(
    petition,
  ).validate();

  const userId = applicationContext.getCurrentUser().userId;

  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  const user = await applicationContext.getUseCases().getUser(userId);

  documents.forEach(document => {
    document.userId = userId;
    document.filedBy = `Petitioner ${user.name}`;
  });

  const createdCase = await applicationContext
    .getPersistenceGateway()
    .createCase({
      caseRecord: new Case({
        userId,
        ...petitionEntity.toRawObject(),
        petitioners: [
          {
            ...user,
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
