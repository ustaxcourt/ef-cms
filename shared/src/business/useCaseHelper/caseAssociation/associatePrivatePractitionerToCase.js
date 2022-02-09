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
 * @param {Array} params.representing the contact ids the private practitioner is representing
 * @param {object} providers.user the user object for the logged in user
 * @param {object} providers.serviceIndicator the service indicator
 * @returns {Promise<*>} the updated case entity
 */
exports.associatePrivatePractitionerToCase = async ({
  applicationContext,
  docketNumber,
  representing,
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

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const isPrivatePractitionerOnCase = caseToUpdate.privatePractitioners?.some(
    practitioner => practitioner.userId === user.userId,
  );

  if (isPrivatePractitionerOnCase) {
    throw new Error(
      `The Private Practitioner is already associated with case ${docketNumber}.`,
    );
  }

  if (!isAssociated) {
    const userCaseEntity = new UserCase(caseToUpdate);

    await applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      docketNumber,
      userCase: userCaseEntity.validate().toRawObject(),
      userId: user.userId,
    });
  } else {
    applicationContext.logger.info(
      `BUG 9323: Private Practitioner with userId: ${user.userId} was already associated with case ${docketNumber} but did not appear in the privatePractitioners array.`,
    );
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const { petitioners } = caseEntity;

  petitioners.map(petitioner => {
    if (representing.includes(petitioner.contactId)) {
      petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    }
  });

  caseEntity.attachPrivatePractitioner(
    new PrivatePractitioner({
      ...user,
      representing,
      serviceIndicator,
    }),
  );

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  return caseEntity.toRawObject();
};
