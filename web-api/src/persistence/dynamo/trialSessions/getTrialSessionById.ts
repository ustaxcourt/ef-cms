import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { get } from '../../dynamodbClientService';

export const getTrialSessionById = ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
}): Promise<RawTrialSession> =>
  get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });
