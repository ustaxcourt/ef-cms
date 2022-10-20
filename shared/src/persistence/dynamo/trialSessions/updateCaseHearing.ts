import { put } from '../../dynamodbClientService';

export const updateCaseHearing = ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  hearingToUpdate: TTrialSessionEntity;
}) =>
  put({
    Item: {
      ...hearingToUpdate,
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
