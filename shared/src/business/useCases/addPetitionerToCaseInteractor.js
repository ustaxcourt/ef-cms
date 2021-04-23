const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { Petitioner } = require('../entities/contacts/Petitioner');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used to add a petitioner to a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contact the contact data to add to the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */
exports.addPetitionerToCaseInteractor = async (
  applicationContext,
  { caseCaption, contact, docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized for adding petitioner to case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseEntity.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${docketNumber} has not been served`,
    );
  }

  caseEntity.caseCaption = caseCaption;

  const petitionerEntity = new Petitioner(contact, {
    applicationContext,
  });

  caseEntity.addPetitioner(petitionerEntity);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
