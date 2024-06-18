import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const deleteDocketEntryWorksheetInteractor = async (
  applicationContext: ServerApplicationContext,
  docketEntryId: string,
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();
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
