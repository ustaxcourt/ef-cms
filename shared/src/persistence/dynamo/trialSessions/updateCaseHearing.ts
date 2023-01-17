import { TRawTrialSession } from '../../../business/entities/trialSessions/TrialSession';
import { put } from '../../dynamodbClientService';

export const updateCaseHearing = ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  hearingToUpdate: TRawTrialSession;
}) =>
  put({
    Item: {
      ...hearingToUpdate,
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
