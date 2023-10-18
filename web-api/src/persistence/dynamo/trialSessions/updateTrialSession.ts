import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

const fieldsToOmitBeforePersisting = ['paperServicePdfs'];

export const updateTrialSession = async ({
  applicationContext,
  trialSessionToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionToUpdate: RawTrialSession;
}) => {
  for (const item of trialSessionToUpdate.paperServicePdfs) {
    await put({
      Item: {
        ...item,
        pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
        sk: `paper-service-pdf|${item.documentId}`,
      },
      applicationContext,
    });
  }

  await put({
    Item: {
      ...omit(trialSessionToUpdate, fieldsToOmitBeforePersisting),
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
};
