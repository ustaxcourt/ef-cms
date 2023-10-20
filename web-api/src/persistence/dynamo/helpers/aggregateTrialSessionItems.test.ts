import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { aggregateTrialSessionItems } from './aggregateTrialSessionItems';

describe('aggregateTrialSessionItems', () => {
  const mockTrialSessionId = '2e709fe0-49aa-45a9-81d4-c769141854ca';
  const mockFileId = 'cb59ea2d-7b22-4e43-bf7c-8f31f865238e';

  const trialSessionRecord = {
    ...MOCK_TRIAL_REMOTE,
    entityName: 'TrialSession',
    pk: `trial-session|${mockTrialSessionId}`,
    sk: `trial-session|${mockTrialSessionId}`,
  };

  const initialCalendaringPaperServicePdf = {
    fileId: mockFileId,
    pk: `trial-session|${mockTrialSessionId}`,
    sk: `paper-service-pdf|${mockFileId}`,
    title: 'Initial Calendaring',
  };

  it('should return an object containing trial session data and its associated entities', () => {
    const trialSessionAndTrialSessionItems = [
      trialSessionRecord,
      initialCalendaringPaperServicePdf,
    ];

    const aggregated = aggregateTrialSessionItems(
      trialSessionAndTrialSessionItems,
    );

    expect(aggregated).toMatchObject({
      ...trialSessionRecord,
      paperServicePdfs: [initialCalendaringPaperServicePdf],
    });
  });
});
