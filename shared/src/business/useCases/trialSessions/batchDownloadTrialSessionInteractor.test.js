const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  batchDownloadTrialSessionInteractor,
} = require('./batchDownloadTrialSessionInteractor');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('batchDownloadTrialSessionInteractor', () => {
  let user;

  beforeEach(() => {
    const mockCase = {
      ...MOCK_CASE,
    };

    mockCase.docketEntries = [
      ...mockCase.docketEntries,
      {
        docketEntryId: '25ae8e71-9dc4-40c6-bece-89acb974a82e',
        documentTitle: 'fourth record',
        documentType: 'Stipulated Decision',
        entityName: 'DocketEntry',
        eventCode: 'SDEC',
        filingDate: '2018-03-01T00:03:00.000Z',
        index: 4,
        isDraft: false,
        isFileAttached: true,
        isMinuteEntry: false,
        isOnDocketRecord: true,
        userId: 'abc-123',
      },
      {
        docketEntryId: '8cc873b5-34ea-464e-a7cd-bbcc4f7a2e31',
        documentTitle: 'fifth record',
        documentType: 'Stipulated Decision',
        entityName: 'DocketEntry',
        eventCode: 'SDEC',
        filingDate: '2018-03-02T00:03:00.000Z',
        index: 5,
        isDraft: false,
        isFileAttached: false,
        isMinuteEntry: false,
        isOnDocketRecord: true,
        userId: 'abc-123',
      },
    ];

    user = {
      role: ROLES.judge,
      userId: 'abc-123',
    };
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...mockCase,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'something' });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        startDate: new Date('2019-09-26T12:00:00.000Z'),
        trialLocation: 'Birmingham',
      });

    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue({});
  });

  it('skips DocketEntry that are not in docketrecord or have documents in S3', async () => {
    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      extraFileNames: expect.anything(),
      extraFiles: expect.anything(),
      fileNames: expect.anything(),
      onEntry: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        '25ae8e71-9dc4-40c6-bece-89acb974a82e',
      ],
      uploadToTempBucket: true,
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'abc-123',
    };

    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(applicationContext.logger.info).toHaveBeenCalledWith(
      'Error',
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: 'abc-123',
    });
  });

  it('calls persistence functions to fetch trial sessions and associated cases and then zips their associated documents', async () => {
    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalled();
  });

  it('should filter closed cases from batch', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.closed,
        },
      ]);

    await batchDownloadTrialSessionInteractor({
      applicationContext,
      trialSessionId: '123',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith({
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
