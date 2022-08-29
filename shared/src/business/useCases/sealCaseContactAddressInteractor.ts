const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/cases/Case');

/**
 * sealCaseContactAddressInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the id of the contact address to be sealed
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {object} the updated case data
 */
exports.sealCaseContactAddressInteractor = async (
  applicationContext,
  { contactId, docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError(
      'Unauthorized for sealing case contact addresses',
    );
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, {
    applicationContext,
  });

  const contactToSeal = caseEntity.getPetitionerById(contactId);

  if (!contactToSeal) {
    throw new UnprocessableEntityError(
      `Cannot seal contact ${contactId}: not found on ${docketNumber}`,
    );
  }
  contactToSeal.isAddressSealed = true;

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).toRawObject();
};
