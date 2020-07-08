const { Case } = require('../../entities/cases/Case');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UserCase } = require('../../entities/UserCase');

/**
 * associatePrivatePractitionerToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {boolean} providers.representingPrimary true if the practitioner is
 * representing the primary contact on the case, false otherwise
 * @param {boolean} providers.representingSecondary true if the practitioner is
 * representing the secondary contact on the case, false otherwise
 * @param {object} providers.user the user object for the logged in user
 * @param {object} providers.serviceIndicator the service indicator
 * @returns {Promise<*>} the updated case entity
 */
exports.associatePrivatePractitionerToCase = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
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

    caseEntity.attachPrivatePractitioner(
      new PrivatePractitioner({
        ...user,
        representingPrimary,
        representingSecondary,
        serviceIndicator,
      }),
    );

    if (representingPrimary) {
      caseEntity.contactPrimary.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_NONE;
    }
    if (caseEntity.contactSecondary && representingSecondary) {
      caseEntity.contactSecondary.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_NONE;
    }

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
