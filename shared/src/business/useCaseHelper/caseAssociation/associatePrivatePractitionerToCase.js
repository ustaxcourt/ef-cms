const { Case } = require('../../entities/cases/Case');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UserCase } = require('../../entities/UserCase');

/**
 * associatePrivatePractitionerToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
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
  docketNumber,
  representingPrimary,
  representingSecondary,
  serviceIndicator,
  user,
}) => {
  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: user.userId,
    });

  if (!isAssociated) {
    const caseToUpdate = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    const userCaseEntity = new UserCase(caseToUpdate);

    await applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      docketNumber,
      userCase: userCaseEntity.validate().toRawObject(),
      userId: user.userId,
    });

    const caseEntity = new Case(caseToUpdate, { applicationContext });

    const contactPrimary = caseEntity.getContactPrimary();
    const contactSecondary = caseEntity.getContactSecondary();

    const representing = [];
    if (representingPrimary) {
      representing.push(contactPrimary.contactId);
    }
    if (representingSecondary) {
      representing.push(contactSecondary.contactId);
    }

    caseEntity.attachPrivatePractitioner(
      new PrivatePractitioner({
        ...user,
        representing,
        serviceIndicator,
      }),
    );

    if (representingPrimary) {
      contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    }
    if (contactSecondary && representingSecondary) {
      contactSecondary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    }

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    return caseEntity.toRawObject();
  }
};
