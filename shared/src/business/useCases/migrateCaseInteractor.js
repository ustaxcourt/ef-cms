const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseMetadata the case metadata
 * @returns {object} the created case
 */
exports.migrateCaseInteractor = async ({
  applicationContext,
  caseMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MIGRATE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToAdd = new Case(
    {
      ...caseMetadata,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  // when part of a consolidated case, run the update use case
  // which will link the cases together in DynamoDB
  if (caseToAdd.leadCaseId) {
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseToAdd.validate().toRawObject(),
    });
  }

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
