import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { queryFull } from '../../dynamodbClientService';

export const getTrialSessions = ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'trial-session-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  }) as unknown as Promise<RawTrialSession[]>;
