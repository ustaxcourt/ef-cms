const { Case } = require('../../entities/cases/Case');
const { Respondent } = require('../../entities/Respondent');

/**
 * associateRespondentToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {object} providers.user the user object for the logged in user
 * @returns {Promise<*>} the updated case entity
 */
exports.associateRespondentToCase = async ({
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

    const caseEntity = new Case({ applicationContext, rawCase: caseToUpdate });

    caseEntity.attachRespondent(new Respondent(user));

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
