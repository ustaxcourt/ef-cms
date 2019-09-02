const { Case } = require('../../entities/cases/Case');
const { Practitioner } = require('../../entities/Practitioner');

/**
 * associatePractitionerToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {boolean} providers.representingPrimary true if the practitioner is
 * representing the primary contact on the case, false otherwise
 * @param {boolean} providers.representingSecondary true if the practitioner is
 * representing the secondary contact on the case, false otherwise
 * @param {object} providers.user the user object for the logged in user
 * @returns {Promise<*>} the updated case entity
 */
exports.associatePractitionerToCase = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
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

    const caseEntity = new Case(caseToUpdate, { applicationContext });

    caseEntity.attachPractitioner(
      new Practitioner({
        ...user,
        representingPrimary,
        representingSecondary,
      }),
    );

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    return caseEntity.toRawObject();
  }
};
