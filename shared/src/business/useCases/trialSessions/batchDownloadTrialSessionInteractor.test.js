import { batchDownloadTrialSessionInteractor } from './batchDownloadTrialSessionInteractor';

const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('batchDownloadTrialSessionInteractor', () => {
  let applicationContext, getCalendaredCasesForTrialSessionMock;
  const getTrialSessionByIdMock = jest.fn(() => {
    return {
      startDate: new Date('2019-09-26T12:00:00.000Z'),
      trialLocation: 'Birmingham',
    };
  });

  const zipDocumentsMock = jest.fn();
  const getDownloadPolicyUrlMock = jest.fn(() => ({ url: 'something' }));

  beforeEach(() => {
    getCalendaredCasesForTrialSessionMock = jest.fn(() => [
      {
        ...MOCK_CASE,
      },
    ]);
    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.judge,
        userId: 'abc-123',
      }),
      getNotificationGateway: () => ({ sendNotificationToUser: () => {} }),
      getPersistenceGateway: () => ({
        getCalendaredCasesForTrialSession: getCalendaredCasesForTrialSessionMock,
        getDownloadPolicyUrl: getDownloadPolicyUrlMock,
        getTrialSessionById: getTrialSessionByIdMock,
        zipDocuments: zipDocumentsMock,
      }),
      getUseCases: () => ({
        generateDocketRecordPdfInteractor: async () => {},
      }),
    };
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    let error;
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
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

    expect(error.message).toEqual('Unauthorized');
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

  it('should filter closed cases from batch', async () => {
    getCalendaredCasesForTrialSessionMock = jest.fn(() => [
      {
        ...MOCK_CASE,
        status: Case.STATUS_TYPES.closed,
      },
    ]);

    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(getTrialSessionByIdMock).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSessionMock).toHaveBeenCalled();
    expect(zipDocumentsMock).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      extraFileNames: [],
      extraFiles: [],
      fileNames: [],
      onEntry: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [],
      uploadToTempBucket: true,
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });
});
