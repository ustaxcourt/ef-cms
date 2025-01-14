import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';

export const getMinuteSheetInteractor = async (
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<any> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const minuteSheet = await getMinuteSheet({
    docketNumber,
    trialSessionId,
  });

  return minuteSheet?.content;
};
