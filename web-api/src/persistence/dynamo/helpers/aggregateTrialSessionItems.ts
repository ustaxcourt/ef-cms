export const isPaperServicePdfItem = item =>
  item.sk.startsWith('paper-service-pdf|');

const isTrialSessionItem = item => item.sk.startsWith('trial-session|');

export const aggregateTrialSessionItems = (items): RawTrialSession => {
  let paperServicePdfs = [];
  let trialSessionRecords = [];

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
