import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteDocketEntryWorksheet } from '@web-api/persistence/postgres/docketEntryWorksheets/deleteDocketEntryWorksheet';

export const deleteDocketEntryWorksheetInteractor = async (
  docketEntryId: string,
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.DELETE_DOCKET_ENTRY_WORKSHEET,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  await deleteDocketEntryWorksheet({ docketEntryId });
};
