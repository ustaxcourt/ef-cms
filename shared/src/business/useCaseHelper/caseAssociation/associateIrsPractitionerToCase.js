const { Case } = require('../../entities/cases/Case');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { UserCase } = require('../../entities/UserCase');

/**
 * associateIrsPractitionerToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.serviceIndicator the type of service the irsPractitioner should receive
 * @param {object} providers.user the user object for the logged in user
 * @returns {Promise<*>} the updated case entity
 */
exports.associateIrsPractitionerToCase = async ({
  applicationContext,
  caseId,
  serviceIndicator,
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
    const caseToUpdate = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    const userCaseEntity = new UserCase(caseToUpdate);

    await applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      caseId: caseId,
      userCase: userCaseEntity.validate().toRawObject(),
      userId: user.userId,
    });

    const caseEntity = new Case(caseToUpdate, { applicationContext });

    caseEntity.attachIrsPractitioner(
      new IrsPractitioner({ ...user, serviceIndicator }),
    );

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
