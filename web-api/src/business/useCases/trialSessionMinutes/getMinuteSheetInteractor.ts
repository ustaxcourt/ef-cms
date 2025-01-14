import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { query } from '@web-api/persistence/dynamodbClientService';

export const getMinuteSheetInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<any> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

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

  let minuteSheet: any;
  if (results.length > 0) {
    minuteSheet = results[0];
    delete minuteSheet.pk;
    delete minuteSheet.sk;
  }

  return minuteSheet;
};
