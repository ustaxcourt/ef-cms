import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnauthorizedError,
  UnprocessableEntityError,
} from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * unsealCaseContactAddress
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the id of the contact address to be unsealed
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {object} the updated case data
 */
export const unsealCaseContactAddress = async (
  _applicationContext: ServerApplicationContext,
  { contactId, docketNumber },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UNSEAL_ADDRESS)) {
    throw new UnauthorizedError(
      'Unauthorized for unsealing case contact addresses',
    );
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });

  const contactToUnseal = caseEntity.getPetitionerById(contactId);

  if (!contactToUnseal) {
    throw new UnprocessableEntityError(
      `Cannot unseal contact ${contactId}: not found on ${docketNumber}`,
    );
  }
  contactToUnseal.isAddressSealed = false;

  caseEntity.updatePetitioner({ updatedPetitioner: contactToUnseal });

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

export const unsealCaseContactAddressInteractor = withLocking(
  unsealCaseContactAddress,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
