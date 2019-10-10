import { batchDownloadTrialSessionInteractor } from './batchDownloadTrialSessionInteractor';

const { MOCK_CASE } = require('../../../test/mockCase');

describe('batchDownloadTrialSessionInteractor', () => {
  let applicationContext;
  const getTrialSessionByIdMock = jest.fn(() => {
    return {
      startDate: new Date(),
      trialLocation: 'Birmingham',
    };
  });
  const getCalendaredCasesForTrialSessionMock = jest.fn(() => [
    {
      ...MOCK_CASE,
    },
  ]);

  const zipDocumentsMock = jest.fn();
  const getDownloadPolicyUrlMock = jest.fn();

  beforeEach(() => {
    applicationContext = {
      getCurrentUser: () => ({
        role: 'judge',
        userId: 'abc-123',
      }),
      getPersistenceGateway: () => ({
        getCalendaredCasesForTrialSession: getCalendaredCasesForTrialSessionMock,
        getDownloadPolicyUrl: getDownloadPolicyUrlMock,
        getTrialSessionById: getTrialSessionByIdMock,
        zipDocuments: zipDocumentsMock,
      }),
      getUseCases: () => ({
        generateDocketRecordPdfInteractor: () => {},
      }),
    };
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    let error;
    applicationContext.getCurrentUser = () => ({
      role: 'petitioner',
      userId: 'abc-123',
    });
    try {
      await batchDownloadTrialSessionInteractor({
        applicationContext,
        trialSessionId: '123',
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('[403] Unauthorized');
  });

  it('calls persistence functions to fetch trial sessions and associated cases and then zips their associated documents', async () => {
    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(getTrialSessionByIdMock).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSessionMock).toHaveBeenCalled();
    expect(zipDocumentsMock).toHaveBeenCalled();
  });
});
