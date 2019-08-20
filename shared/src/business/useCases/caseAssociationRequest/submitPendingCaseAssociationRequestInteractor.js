const { UnauthorizedError } = require('../../../errors/errors');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @returns {Promise<*>} the promise of the pending case assocation request
 */
exports.submitPendingCaseAssociationRequestInteractor = async ({
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
