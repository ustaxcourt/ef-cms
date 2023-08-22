import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { put } from '../../dynamodbClientService';

export const updateTrialSession = ({
  applicationContext,
  trialSessionToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionToUpdate: RawTrialSession;
}) =>
  put({
    Item: {
      ...trialSessionToUpdate,
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
