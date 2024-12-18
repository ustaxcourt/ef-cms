import { FormattedMinuteSheet } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put, query } from '@web-api/persistence/dynamodbClientService';

export const updateMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, minuteSheet, trialSessionId }: MinuteSheetUpdateBody,
  // authorizedUser: UnknownAuthUser,
): Promise<any> => {
  // 10419 TODO: add role-permissions configuration for minutes sheet
  //   if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MINUTES_SHEET)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }

  // const minuteSheet = await query({
  //   ExpressionAttributeNames: {
  //     '#pk': 'pk',
  //   },
  //   ExpressionAttributeValues: {
  //     ':pk': `${trialSessionId}|${docketNumber}`,
  //   },
  //   KeyConditionExpression: '#pk = :pk',
  //   applicationContext,
  // });
  // console.log('Docket Number: ', docketNumber);
  // console.log('TrialSessionId: ', trialSessionId);
  // console.log('minuteSheet: ', minuteSheet);

  console.log('*************** minute sheet before save', minuteSheet);
  const serializedMinuteSheet = JSON.stringify(minuteSheet);
  const updatedMinuteSheet = await put({
    Item: {
      minuteSheet: serializedMinuteSheet,
      pk: `${trialSessionId}|${docketNumber}`,
      sk: `${trialSessionId}|${docketNumber}`,
    },
    applicationContext,
  });

  return updatedMinuteSheet;
};

export type MinuteSheetUpdateBody = {
  docketNumber: string;
  trialSessionId: string;
  minuteSheet: FormattedMinuteSheet;
};
