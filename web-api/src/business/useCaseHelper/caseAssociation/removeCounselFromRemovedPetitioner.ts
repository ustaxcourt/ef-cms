import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
/**
 * removeCounselFromRemovedPetitioner
 *
 * @param {object} options the options object
 * @param {object} options.applicationContext the applicationContext
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.petitionerContactId the contactId of the petitioner being removed from the case
 * @returns {Case} the updated case entity
 */
export const removeCounselFromRemovedPetitioner = async ({
  applicationContext,
  caseEntity,
  petitionerContactId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.QC_PETITION) &&
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitioners =
    caseEntity.getPractitionersRepresenting(petitionerContactId);

  for (const practitioner of practitioners) {
    if (practitioner.representing.length === 1) {
      caseEntity.removePrivatePractitioner(practitioner);

      await applicationContext.getPersistenceGateway().deleteUserFromCase({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        userId: practitioner.userId,
      });
    } else {
      caseEntity.removeRepresentingFromPractitioners(petitionerContactId);
    }
  }

  return caseEntity.validate();
};
