import { ServerApplicationContext } from '@web-api/applicationContext';
import { query } from '@web-api/persistence/dynamodbClientService';

export const getMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  // authorizedUser: UnknownAuthUser,
): Promise<any> => {
  // 10419 TODO: add role-permissions configuration for minutes sheet
  //   if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MINUTES_SHEET)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }

  const results = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${trialSessionId}|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  console.log('getting minute sheet', `${docketNumber} - ${trialSessionId}`);

  const minuteSheet: any = results[0];
  delete minuteSheet.pk;
  delete minuteSheet.sk;

  return minuteSheet;
};
