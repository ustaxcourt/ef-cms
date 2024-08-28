import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const deleteDocketEntryWorksheetInteractor = async (
  applicationContext: ServerApplicationContext,
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

  await applicationContext
    .getPersistenceGateway()
    .deleteDocketEntryWorksheetRecord({
      applicationContext,
      docketEntryId,
    });
};
