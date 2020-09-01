const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { CaseDeadline } = require('../entities/CaseDeadline');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadlineMetadata the case deadline metadata
 * @returns {object} the created case deadline
 */
exports.migrateCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadlineMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MIGRATE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseDeadlineToAdd = new CaseDeadline(
    {
      ...caseDeadlineMetadata,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  const caseDeadlineValidatedRaw = caseDeadlineToAdd.validate().toRawObject();

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: caseDeadlineValidatedRaw,
  });

  return caseDeadlineValidatedRaw;
};
