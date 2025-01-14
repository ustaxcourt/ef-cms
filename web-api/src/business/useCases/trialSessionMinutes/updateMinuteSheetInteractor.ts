import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { put } from '@web-api/persistence/dynamodbClientService';

export const updateMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, minuteSheet, trialSessionId }: MinuteSheetUpdateBody,
  authorizedUser: UnknownAuthUser,
): Promise<any> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // TODO 10419: discuss peristence options, modify this as needed.
  const serializedMinuteSheet = JSON.stringify(minuteSheet);
  const updatedMinuteSheet: any = await put({
    Item: {
      minuteSheet: serializedMinuteSheet,
      pk: `${trialSessionId}|${docketNumber}`,
      sk: `${trialSessionId}|${docketNumber}`,
    },
    applicationContext,
  });

  delete updatedMinuteSheet.pk;
  delete updatedMinuteSheet.sk;

  return updatedMinuteSheet;
};

export type MinuteSheetUpdateBody = {
  docketNumber: string;
  trialSessionId: string;
  minuteSheet: any; // TODO 10419: define this type
};
