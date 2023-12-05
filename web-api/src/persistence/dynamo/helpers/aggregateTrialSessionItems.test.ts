import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import {
  TrialSessionPaperPdfRecord,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { aggregateTrialSessionItems } from './aggregateTrialSessionItems';

describe('aggregateTrialSessionItems', () => {
  const mockTrialSessionId = '2e709fe0-49aa-45a9-81d4-c769141854ca';
  const mockFileId = 'cb59ea2d-7b22-4e43-bf7c-8f31f865238e';

  const trialSessionRecord: TrialSessionRecord = {
    ...MOCK_TRIAL_REMOTE,
    entityName: 'TrialSession',
    pk: `trial-session|${mockTrialSessionId}`,
    sk: `trial-session|${mockTrialSessionId}`,
  };

  const initialCalendaringPaperServicePdf: TrialSessionPaperPdfRecord = {
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

  it('should return undefined if no items have a trial session record', () => {
    const retval = aggregateTrialSessionItems([]);

    expect(retval).toEqual(undefined);
  });

  it('should filter out pdf links that are older than 3 days', () => {
    const trialSessionAndTrialSessionItems = [
      trialSessionRecord,
      { ...initialCalendaringPaperServicePdf, ttl: 1000 },
    ];

    const aggregated = aggregateTrialSessionItems(
      trialSessionAndTrialSessionItems,
    );

    expect(aggregated).toMatchObject({
      ...trialSessionRecord,
      paperServicePdfs: [],
    });
  });
});
