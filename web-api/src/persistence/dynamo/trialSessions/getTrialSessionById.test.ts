import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import {
  TrialSessionPaperPdfRecord,
  TrialSessionRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionById } from './getTrialSessionById';
import { omit } from 'lodash';

describe('getTrialSessionById', () => {
  let mockTrialSessionRecord: TrialSessionRecord;
  let mockTrialSessionPdf: TrialSessionPaperPdfRecord;
  beforeAll(() => {
    mockTrialSessionRecord = {
      ...omit(MOCK_TRIAL_INPERSON, 'paperServicePdfs'),
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
      sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
    };
    mockTrialSessionPdf = {
      fileId: '6e1cbb0e-c727-41df-a10c-1be1b8576de2',
      pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
      sk: 'paper-service-pdf|6e1cbb0e-c727-41df-a10c-1be1b8576de2',
      title: 'Notice of Change of Trial Judge',
    };

    applicationContext.getDocumentClient().query.mockResolvedValue({
      Items: [mockTrialSessionPdf, mockTrialSessionRecord],
    });
  });

  it('should get the trial session by id', async () => {
    const result = await getTrialSessionById({
      applicationContext,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(result).toEqual({
      ...MOCK_TRIAL_INPERSON,
      gsi1pk: 'trial-session-catalog',
      paperServicePdfs: [mockTrialSessionPdf],
      pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
      sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
    });
  });
});
