import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { aggregateTrialSessionItems } from '@web-api/persistence/dynamo/helpers/aggregateTrialSessionItems';
import { query } from '../../dynamodbClientService';

export const getTrialSessionById = async ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
}): Promise<RawTrialSession> => {
  const trialSessionItems = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `trial-session|${trialSessionId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  return aggregateTrialSessionItems(trialSessionItems) as RawTrialSession;
};
