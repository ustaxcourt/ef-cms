import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/updateMinuteSheet';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const updateMinuteSheetInteractor = async (
  { docketNumber, minuteSheet, trialSessionId }: MinuteSheetUpdateBody,
  authorizedUser: UnknownAuthUser,
): Promise<any> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const updatedMinuteSheet = await upsertMinuteSheet({
    minuteSheetToUpsert: {
      content: minuteSheet,
      docketNumber,
      trialSessionId,
    },
  });

  return updatedMinuteSheet;
};

export type MinuteSheetUpdateBody = {
  docketNumber: string;
  trialSessionId: string;
  minuteSheet: MinuteSheet;
};
