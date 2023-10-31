import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  TrialSessionPaperPdfRecord,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';

export const aggregateTrialSessionItems = (items): RawTrialSession => {
  let paperServicePdfs: { title: string; fileId: string }[] = [];

  let trialSession: RawTrialSession | undefined;
  items.forEach(item => {
    if (isTrialSessionItem(item)) {
      trialSession = item as unknown as RawTrialSession;
    }
    if (isPaperServicePdfItem(item)) {
      paperServicePdfs.push(item);
    }
  });

  if (!trialSession) {
    throw new Error(
      'No trial session record found. Cannot form trial session from given records.',
    );
  }

  trialSession.paperServicePdfs = paperServicePdfs;

  return trialSession;
};

const isTrialSessionItem = (item: any): item is TrialSessionRecord =>
  item?.pk?.startsWith('trial-session|') &&
  item?.sk?.startsWith('trial-session|');

const isPaperServicePdfItem = (item: any): item is TrialSessionPaperPdfRecord =>
  item?.pk?.startsWith('trial-session|') &&
  item?.sk?.startsWith('paper-service-pdf|');
