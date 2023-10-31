import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep, omit } from 'lodash';
import { updateTrialSession } from './updateTrialSession';

describe('updateTrialSession', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().batchWrite.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('invokes the persistence layer with pk of trial-session|{trialSessionId}, sk of trial-session|{trialSessionId} and other expected params', async () => {
    const trialSessionToUpdate = MOCK_TRIAL_INPERSON;

    await updateTrialSession({
      applicationContext,
      trialSessionToUpdate,
    });

    expect(
      applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
    ).toEqual({
      RequestItems: {
        ['efcms-local']: [
          {
            PutRequest: {
              Item: {
                gsi1pk: 'trial-session-catalog',
                pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                ...omit(trialSessionToUpdate, 'paperServicePdfs'),
              },
            },
          },
        ],
      },
    });
  });

  it('should only write new paper service pdfs to persistence and not touch old pdfs so that the old can expire', async () => {
    const existingPaperPdf = {
      fileId: '40f1e810-78bd-4bb2-b20f-735b8b9603ac',
      title: 'existing Pdf',
    };
    const newPaperPdf = {
      fileId: '52647562-ca8c-4610-bb9b-8dafe6bfb74c',
      title: 'new Pdf',
    };
    const trialSessionToUpdate = cloneDeep(MOCK_TRIAL_INPERSON);
    trialSessionToUpdate.paperServicePdfs = [existingPaperPdf, newPaperPdf];
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              ...existingPaperPdf,
              pk: 'trial-session|123-20',
              sk: 'paper-service|23',
            },
          ],
        }),
    });

    await updateTrialSession({
      applicationContext,
      trialSessionToUpdate,
    });

    expect(
      applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
    ).toEqual({
      RequestItems: {
        ['efcms-local']: [
          {
            PutRequest: {
              Item: {
                gsi1pk: 'trial-session-catalog',
                pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                ...omit(trialSessionToUpdate, 'paperServicePdfs'),
              },
            },
          },
          {
            PutRequest: {
              Item: {
                pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                sk: `paper-service-pdf|${newPaperPdf.fileId}`,
                ttl: expect.anything(),
                ...newPaperPdf,
              },
            },
          },
        ],
      },
    });
  });
});
