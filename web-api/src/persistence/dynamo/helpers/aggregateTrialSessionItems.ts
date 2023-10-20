import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

export const aggregateTrialSessionItems = (items): RawTrialSession => {
  let paperServicePdfs: { title: string; fileId: string }[] = [];
  let trialSessionRecords: Omit<RawTrialSession, 'paperServicePdfs'>[] = [];

  items.forEach(item => {
    if (isTrialSessionItem(item)) {
      trialSessionRecords.push(item);
    }
    if (isPaperServicePdfItem(item)) {
      paperServicePdfs.push(item);
    }
  });

  const theTrialSession = trialSessionRecords.pop();

  return {
    ...theTrialSession,
    paperServicePdfs,
  };
};

const isTrialSessionItem = item => item.sk.startsWith('trial-session|');

const isPaperServicePdfItem = item => item.sk.startsWith('paper-service-pdf|');
