const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitPendingCaseAssociationRequest = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (user.role !== 'practitioner') {
    throw new UnauthorizedError('Unauthorized');
  }

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
