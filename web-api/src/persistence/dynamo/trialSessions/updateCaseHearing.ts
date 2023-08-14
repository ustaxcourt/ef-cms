import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { put } from '../../dynamodbClientService';

export const updateCaseHearing = ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  hearingToUpdate: RawTrialSession;
}) =>
  put({
    Item: {
      ...hearingToUpdate,
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
