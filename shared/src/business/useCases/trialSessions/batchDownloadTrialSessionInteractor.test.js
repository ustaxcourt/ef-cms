const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  batchDownloadTrialSessionInteractor,
  generateValidDocketEntryFilename,
} = require('./batchDownloadTrialSessionInteractor');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('batchDownloadTrialSessionInteractor', () => {
  let user;
  let mockCase;

  beforeEach(() => {
    mockCase = {
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
        startDate: '2019-09-26T12:00:00.000Z',
        trialLocation: 'Birmingham',
      });

    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue({});

    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);
  });

  describe('file name generation', () => {
    it('truncates filenames if long document title causes them to exceed 255 characters', () => {
      const docketEntry = {
        documentTitle:
          'Harrell slipped the cool bulk of the thought-helmet over his head and signalled to the scientist, who pulled the actuator switch. Harrell shuddered as psionic current surged through him; he stiffened, wriggled, and felt himself glide out of his body, hover incorporeally in the air between his now soulless shell and the alien bound opposite.',
        filingDate: '2020-06-20T15:43:12.000Z',
        index: '7',
      };
      const expectedName =
        '2020-06-20_0007_Harrell slipped the cool bulk of the thought-helmet over his head and signalled to the scientist, who pulled the actuator switch. Harrell shuddered as psionic current surged throug.pdf';
      const filename = generateValidDocketEntryFilename(docketEntry);
      expect(filename.length).toBe(200);
      expect(filename).toBe(expectedName);
    });
    it('generates a filename without any truncation when overall length is 255 characters or less', () => {
      const docketEntry = {
        documentTitle:
          "Harrell met the downcrashing blow of the alien's broad-sword fully; the shock of impact sent numbing shivers up his arm as far as his shoulder but he held on and turned aside the b",
        filingDate: '2020-06-20T15:43:12.000Z',
        index: '7',
      };

      const maxTitleLength = 180; // when not accounting for length of date, docket entry number, and file extension components
      expect(docketEntry.documentTitle.length).toBe(maxTitleLength); // asserting we are starting with a string exactly of max length

      const expectedName = `2020-06-20_0007_${docketEntry.documentTitle}.pdf`;
      const filename = generateValidDocketEntryFilename(docketEntry);
      expect(filename.length).toBe(200);
      expect(filename).toBe(expectedName);
    });
  });
  it('skips DocketEntry that are not in docketrecord or have documents in S3', async () => {
    await batchDownloadTrialSessionInteractor(applicationContext, {
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
      onError: expect.anything(),
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

  it('checks that the files to be zipped exist in persistence when verifyFiles param is true', async () => {
    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
      verifyFiles: true,
    });

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).toHaveBeenCalledTimes(2);
  });

  it('throws an error if a file to be zipped does not exist in persistence when verifyFiles param is true', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
      verifyFiles: true,
    });

    const errorCall =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0];

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).toHaveBeenCalled();
    expect(errorCall).toBeTruthy();
    expect(errorCall[0].message.error.message).toEqual(
      `Batch Download Error: File ${mockCase.docketEntries[0].docketEntryId} for case ${mockCase.docketNumber} does not exist!`,
    );
  });

  it('does not check for missing files or throw an associated error if a file to be zipped does not exist in persistence when verifyFiles param is false', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
      verifyFiles: false,
    });

    const errorCall =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0];

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();
    expect(errorCall[0].message.error).toBeUndefined();
  });

  it('does not check for missing files or throw an associated error if a file to be zipped does not exist in persistence when verifyFiles param is undefined', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
    });

    const errorCall =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0];

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();
    expect(errorCall[0].message.error).toBeUndefined();
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'abc-123',
    };

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
    });

    expect(applicationContext.logger.error).toHaveBeenCalled();
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
    await batchDownloadTrialSessionInteractor(applicationContext, {
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

    await batchDownloadTrialSessionInteractor(applicationContext, {
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
      onError: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [],
      uploadToTempBucket: true,
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('should filter removed cases from batch', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          removedFromTrial: true,
        },
      ]);

    await batchDownloadTrialSessionInteractor(applicationContext, {
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
      onError: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [],
      uploadToTempBucket: true,
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });
});
