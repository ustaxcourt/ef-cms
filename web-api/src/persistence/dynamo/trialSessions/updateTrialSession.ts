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
      ConditionExpression:
        'attribute_not_exists(pk) and attribute_not_exists(sk)',
      Item: {
        ...item,
        pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
        sk: `paper-service-pdf|${item.documentId}`,
        ttl: 60 * 60 * 72,
      },
      applicationContext,
    });
  }

  return put({
    Item: {
      ...omit(trialSessionToUpdate, fieldsToOmitBeforePersisting),
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
};
