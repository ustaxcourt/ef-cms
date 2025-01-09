import { FormattedMinuteSheet } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '@web-api/persistence/dynamodbClientService';

export const updateMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, minuteSheet, trialSessionId }: MinuteSheetUpdateBody,
  // authorizedUser: UnknownAuthUser,
): Promise<any> => {
  // 10419 TODO: add role-permissions configuration for minutes sheet
  //   if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MINUTES_SHEET)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }

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
  minuteSheet: FormattedMinuteSheet;
};
