import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/updateMinuteSheet';

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
  minuteSheet: MinuteSheetFormState; // TODO 10419: define this type better (probs shouldn't have the client defining the interface)
};
