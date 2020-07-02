const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @returns {Promise<*>} the promise of the pending case association request
 */
exports.submitPendingCaseAssociationRequestInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      caseId,
      userId: user.userId,
    });

  const isAssociationPending = await applicationContext
    .getPersistenceGateway()
    .verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId: user.userId,
    });

  if (!isAssociated && !isAssociationPending) {
    await applicationContext
      .getPersistenceGateway()
      .associateUserWithCasePending({
        applicationContext,
        caseId: caseId,
        userId: user.userId,
      });
  }
};
