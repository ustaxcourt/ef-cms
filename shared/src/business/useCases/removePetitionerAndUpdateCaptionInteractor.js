const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used to remove a petitioner from a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseCaption the updated caseCaption
 * @param {object} providers.contactId the contactId of the person to remove from the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */

exports.removePetitionerAndUpdateCaptionInteractor = async (
  applicationContext,
  { caseCaption, contactId, docketNumber },
) => {
  const petitionerContactId = contactId;
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.REMOVE_PETITIONER)) {
    throw new UnauthorizedError(
      'Unauthorized for removing petitioner from case',
    );
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseToUpdate.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${caseToUpdate.docketNumber} has not been served`,
    );
  }

  if (caseEntity.petitioners.length <= 1) {
    throw new Error(
      `Cannot remove petitioner ${petitionerContactId} from case with docketNumber ${caseToUpdate.docketNumber}`,
    );
  }

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .removeCounselFromRemovedPetitioner({
      applicationContext,
      caseEntity,
      petitionerContactId,
    });

  caseEntity.removePetitioner(petitionerContactId);

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    docketNumber,
    userId: petitionerContactId,
  });

  caseEntity.caseCaption = caseCaption;

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
