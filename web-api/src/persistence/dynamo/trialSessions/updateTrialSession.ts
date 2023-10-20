import {
  RawTrialSession,
  TrialSession,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { conditionalPut, put } from '../../dynamodbClientService';
import { omit } from 'lodash';

const fieldsToOmitBeforePersisting = ['paperServicePdfs'];

export const updateTrialSession = async ({
  applicationContext,
  trialSessionToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionToUpdate: RawTrialSession;
}) => {
  for (const item of trialSessionToUpdate.paperServicePdfs) {
    const pk = `trial-session|${trialSessionToUpdate.trialSessionId}`;
    const sk = `paper-service-pdf|${item.documentId}`;

    await conditionalPut({
      ConditionExpression:
        'attribute_not_exists(pk) AND attribute_not_exists(sk)',
      Item: {
        ...item,
        pk,
        sk,
        ttl: TrialSession.PAPER_SERVICE_PDF_TTL,
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
