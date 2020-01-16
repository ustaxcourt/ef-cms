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

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
