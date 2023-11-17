import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  TDynamoRecord,
  TrialSessionPaperPdfRecord,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';

export const aggregateTrialSessionItems = (
  items: TDynamoRecord[],
): RawTrialSession | undefined => {
  let paperServicePdfs: { title: string; fileId: string }[] = [];

  let trialSession: RawTrialSession | undefined;
  items
    .filter(record => {
      return record.ttl ? record.ttl >= Math.floor(Date.now() / 1000) : true;
    })
    .forEach(item => {
      if (isTrialSessionItem(item)) {
        trialSession = item as unknown as RawTrialSession;
      }
      if (isPaperServicePdfItem(item)) {
        paperServicePdfs.push(item);
      }
    });

  if (trialSession) {
    trialSession.paperServicePdfs = paperServicePdfs;
  }

  return trialSession;
};

const isTrialSessionItem = (item: any): item is TrialSessionRecord =>
  item?.pk?.startsWith('trial-session|') &&
  item?.sk?.startsWith('trial-session|');

const isPaperServicePdfItem = (item: any): item is TrialSessionPaperPdfRecord =>
  item?.pk?.startsWith('trial-session|') &&
  item?.sk?.startsWith('paper-service-pdf|');
