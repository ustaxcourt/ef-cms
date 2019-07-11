const { Case } = require('../../entities/cases/Case');
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

  const isPractitioner = user.role === 'practitioner';
  const isRespondent = user.role === 'respondent';

  if (!isPractitioner && !isRespondent) {
    throw new UnauthorizedError('Unauthorized');
  }

  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      caseId,
      userId: user.userId,
    });

  if (!isAssociated) {
    await applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      caseId: caseId,
      userId: user.userId,
    });

    const caseToUpdate = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    const caseEntity = new Case(caseToUpdate);

    if (isPractitioner) {
      caseEntity.attachPractitioner({
        user,
      });
    } else if (isRespondent) {
      caseEntity.attachRespondent({
        user,
      });
    }

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
