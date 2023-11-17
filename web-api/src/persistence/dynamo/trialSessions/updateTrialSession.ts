import {
  PutRequest,
  TrialSessionPaperPdfRecord,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import {
  RawTrialSession,
  TrialSession,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import {
  batchWrite,
  queryFull,
} from '@web-api/persistence/dynamodbClientService';
import { omit } from 'lodash';

export const trialSessionFieldsToOmitBeforePersisting = [
  'paperServicePdfs',
] as const;

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

  if (trialSessionToUpdate.paperServicePdfs.length) {
    const existingPdfIds = await queryFull<TrialSessionPaperPdfRecord>({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `trial-session|${trialSessionToUpdate.trialSessionId}`,
        ':prefix': 'paper-service-pdf',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    }).then(existingPdfs =>
      existingPdfs.map(existingPdf => existingPdf.fileId),
    );

    const newPdfs = trialSessionToUpdate.paperServicePdfs.filter(
      paperPdf => !existingPdfIds.includes(paperPdf.fileId),
    );
    newPdfs
      .map(newPdf => {
        const expireInThreeDays =
          Math.floor(Date.now() / 1000) + TrialSession.PAPER_SERVICE_PDF_TTL;
        const record: TrialSessionPaperPdfRecord = {
          fileId: newPdf.fileId,
          pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
          sk: `paper-service-pdf|${newPdf.fileId}`,
          title: newPdf.title,
          ttl: expireInThreeDays,
        };
        return record;
      })
      .forEach(record => itemsToUpdate.push({ PutRequest: { Item: record } }));
  }

  await batchWrite(itemsToUpdate, applicationContext);
};
