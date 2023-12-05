import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import {
  UnauthorizedError,
  UnprocessableEntityError,
} from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * sealCaseContactAddress
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the id of the contact address to be sealed
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {object} the updated case data
 */
export const sealCaseContactAddress = async (
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

export const sealCaseContactAddressInteractor = withLocking(
  sealCaseContactAddress,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
