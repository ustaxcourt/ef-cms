import { TRawTrialSession } from '../../../business/entities/trialSessions/TrialSession';
import { TransactionBuilder } from '../createTransaction';
import { put } from '../../dynamodbClientService';

export const updateTrialSession = ({
  applicationContext,
  transaction,
  trialSessionToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionToUpdate: TRawTrialSession;
  transaction?: TransactionBuilder;
}) =>
  put({
    Item: {
      ...trialSessionToUpdate,
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    },
    applicationContext,
    transaction,
  });
