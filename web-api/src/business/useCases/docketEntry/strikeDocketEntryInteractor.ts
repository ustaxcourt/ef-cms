import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

export const strikeDocketEntryInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const docketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  docketEntry.strikeEntry({ name: user.name, userId: user.userId });

  const validatedDocketEntry = docketEntry.validate().toRawObject();

  caseEntity.updateDocketEntry(validatedDocketEntry);

  await upsertDocketEntries([validatedDocketEntry]);

  return caseEntity.toRawObject();
};
