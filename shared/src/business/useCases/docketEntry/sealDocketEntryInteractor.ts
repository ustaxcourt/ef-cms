import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

/**
 * seals a given docket entry on a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id to seal
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the updated docket entry after it has been sealed
 */
export const sealDocketEntryInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketEntryId,
    docketEntrySealedTo,
    docketNumber,
  }: {
    docketEntryId: string;
    docketEntrySealedTo: string;
    docketNumber: string;
  },
) => {
  if (!docketEntrySealedTo) {
    throw new Error('Docket entry sealed to is required');
  }

  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError('Docket entry not found');
  }

  docketEntryEntity.sealEntry({ sealedTo: docketEntrySealedTo });

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber,
    document: docketEntryEntity.validate().toRawObject(),
  });

  return docketEntryEntity.toRawObject();
};
