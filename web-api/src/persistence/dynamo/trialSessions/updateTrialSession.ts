import {
  PutRequest,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { batchWrite } from '../../dynamodbClientService';
import { omit } from 'lodash';

export const trialSessionFieldsToOmitBeforePersisting = ['paperServicePdfs'];

export const updateTrialSession = async ({
  applicationContext,
  trialSessionToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionToUpdate: RawTrialSession;
}): Promise<void> => {
  const itemsToUpdate: PutRequest[] = [];
  const trialSessionRecord: TrialSessionRecord = {
    ...omit(trialSessionToUpdate, trialSessionFieldsToOmitBeforePersisting),
    gsi1pk: 'trial-session-catalog',
    pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
  };
  itemsToUpdate.push({ PutRequest: { Item: trialSessionRecord } });

  // for (const item of trialSessionToUpdate.paperServicePdfs) {
  //   const pk = `trial-session|${trialSessionToUpdate.trialSessionId}`;
  //   const sk = `paper-service-pdf|${item.fileId}`;
  //   await conditionalPut({
  //     ConditionExpression:
  //       'attribute_not_exists(pk) AND attribute_not_exists(sk)',
  //     Item: {
  //       ...item,
  //       pk,
  //       sk,
  //       ttl: TrialSession.PAPER_SERVICE_PDF_TTL,
  //     },
  //     applicationContext,
  //   });
  // }
  // return put({
  //   Item: {
  //     ...omit(trialSessionToUpdate, fieldsToOmitBeforePersisting),
  //     gsi1pk: 'trial-session-catalog',
  //     pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
  //     sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
  //   },
  //   applicationContext,
  // });
  await batchWrite(itemsToUpdate, applicationContext);
};

// Remove conditionalPut in favor of skipping over old pdfs
// Use batchwrite
