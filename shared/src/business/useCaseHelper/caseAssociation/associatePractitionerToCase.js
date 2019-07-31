const { Case } = require('../../entities/cases/Case');

/**
 * associatePractitionerToCase
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.associatePractitionerToCase = async ({
  applicationContext,
  caseId,
  user,
}) => {
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

    caseEntity.attachPractitioner({
      user,
    });

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
