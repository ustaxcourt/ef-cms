import { get } from '../../dynamodbClientService';

export const getTrialSessionById = ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
}) =>
  get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });
