const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitCaseAssociationRequest = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (user.role !== 'practitioner') {
    throw new UnauthorizedError('Unauthorized');
  }

  const isAssociated = await applicationContext
    .getUseCases()
    .verifyCaseForUser({
      applicationContext,
      caseId,
      userId: user.userId,
    });

  if (!isAssociated) {
    await applicationContext.getPersistenceGateway().createMappingRecord({
      applicationContext,
      pkId: user.userId,
      skId: caseId,
      type: 'case',
    });
  }
};
