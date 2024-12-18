import { ServerApplicationContext } from '@web-api/applicationContext';
import { put, query } from '@web-api/persistence/dynamodbClientService';

export const updateMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { minuteSheet },
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

  // const updatedMinuteSheet = put({ Item: minuteSheet[0], applicationContext });

  console.log('********** minute sheet updated', `${minuteSheet}`);

  // return updatedMinuteSheet;
};
