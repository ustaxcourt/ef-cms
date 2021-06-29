const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCounselOnCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the user is attached to
 * @param {object} providers.userData the data being updated on the user
 * @param {string} providers.userId the id of the user to be updated on the case
 * @returns {Promise} the promise of the update case call
 */
exports.updateCounselOnCaseInteractor = async (
  applicationContext,
  { docketNumber, userData, userId },
) => {
  const user = applicationContext.getCurrentUser();

  const editableFields = {
    representing: userData.representing,
    serviceIndicator: userData.serviceIndicator,
  };

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const userToUpdate = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToUpdate.role === ROLES.privatePractitioner) {
    caseEntity.updatePrivatePractitioner({
      representing: editableFields.representing,
      userId,
      ...editableFields,
    });

    caseEntity.petitioners.map(petitioner => {
      if (editableFields.representing.includes(petitioner.contactId)) {
        petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
      } else if (
        !caseEntity.isUserIdRepresentedByPrivatePractitioner(
          petitioner.contactId,
        )
      ) {
        const serviceIsPaper = !petitioner.email;
        petitioner.serviceIndicator = serviceIsPaper
          ? SERVICE_INDICATOR_TYPES.SI_PAPER
          : SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    });
  } else if (userToUpdate.role === ROLES.irsPractitioner) {
    caseEntity.updateIrsPractitioner({
      serviceIndicator: editableFields.serviceIndicator,
      userId,
    });
  } else {
    throw new Error('User is not a practitioner');
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
