import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { validateMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/validateMinuteSheet';

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

  if (typeof minuteSheet === 'undefined') return {};

  const isValid = validateMinuteSheet(minuteSheet?.content);

  if (!isValid) throw new InvalidEntityError('Minute Sheet Entity is invalid.');

  return minuteSheet.content;
};
