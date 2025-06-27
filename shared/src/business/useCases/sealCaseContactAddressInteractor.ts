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
 * sealCaseContactAddress
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the id of the contact address to be sealed
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {object} the updated case data
 */
export const sealCaseContactAddress = async (
  _applicationContext: ServerApplicationContext,
  { contactId, docketNumber },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError(
      'Unauthorized for sealing case contact addresses',
    );
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });

  const contactToSeal = caseEntity.getPetitionerById(contactId);

  if (!contactToSeal) {
    throw new UnprocessableEntityError(
      `Cannot seal contact ${contactId}: not found on ${docketNumber}`,
    );
  }
  contactToSeal.isAddressSealed = true;

  caseEntity.updatePetitioner({ updatedPetitioner: contactToSeal });

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).toRawObject();
};

export const sealCaseContactAddressInteractor = withLocking(
  sealCaseContactAddress,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
