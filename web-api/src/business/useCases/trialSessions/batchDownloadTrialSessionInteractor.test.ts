import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  ALLOWLIST_FEATURE_FLAGS,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  batchDownloadTrialSessionInteractor,
  batchDownloadTrialSessionInteractorHelper,
  generateValidDocketEntryFilename,
} from './batchDownloadTrialSessionInteractor';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

jest.mock('@web-api/dispatchers/batch/pollAWSBatchProgress');
import { pollAWSBatchProgress as mockPollAWSBatchProgress } from '@web-api/dispatchers/batch/pollAWSBatchProgress';

describe('batchDownloadTrialSessionInteractor', () => {
  let mockCase;

  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );

  const mockSendNotificationToUser = jest.fn();

  const pollAWSBatchProgress = jest.mocked(mockPollAWSBatchProgress);

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
        isOnDocketRecord: true,
        userId: 'abc-123',
      },
    ];

    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        ...mockCase,
      },
    ]);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'something' });

    getTrialSessionById.mockResolvedValue({
      startDate: '2019-09-26T12:00:00.000Z',
      trialLocation: 'Birmingham',
    } as RawTrialSession);

    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue({
        fileId: '69db2094-b50f-4fe5-9891-1c0b463792f3',
      });

    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);
  });

  beforeAll(() => {
    applicationContext.getNotificationGateway().sendNotificationToUser =
      mockSendNotificationToUser;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('file name generation', () => {
    it('truncates filenames if long document title causes them to exceed 64 characters', () => {
      const docketEntry = {
        documentTitle:
          'Harrell slipped the cool bulk of the thought-helmet over his head and signalled to the scientist, who pulled the actuator switch. Harrell shuddered as psionic current surged through him; he stiffened, wriggled, and felt himself glide out of his body, hover incorporeally in the air between his now soulless shell and the alien bound opposite.',
        eventCode: 'MISC',
        filingDate: '2020-06-20T15:43:12.000Z',
        index: '7',
      };
      const expectedName =
        '2020-06-20_0007_Harrell slipped the cool bulk of the thought.pdf';
      const filename = generateValidDocketEntryFilename(docketEntry);
      expect(filename.length).toBe(64);
      expect(filename).toBe(expectedName);
    });

    it('generates a filename without any truncation when overall length is 64 characters or less', () => {
      const docketEntry = {
        documentTitle: 'Harrell met the downcrashing blow',
        eventCode: 'MISC',
        filingDate: '2020-06-20T15:43:12.000Z',
        index: '7',
      };

      const expectedName =
        '2020-06-20_0007_Harrell met the downcrashing blow.pdf';
      const filename = generateValidDocketEntryFilename(docketEntry);
      expect(filename).toBe(expectedName);
    });
  });

  it('skips DocketEntry that are not in docketrecord or have documents in S3', async () => {
    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [
        {
          filePathInZip: '101-18, Test Petitioner/2018-03-01_0001_Petition.pdf',
          key: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
          useTempBucket: false,
        },
        {
          filePathInZip:
            '101-18, Test Petitioner/2018-02-28_0004_fourth record.pdf',
          key: '25ae8e71-9dc4-40c6-bece-89acb974a82e',
          useTempBucket: false,
        },
        {
          filePathInZip: '101-18, Test Petitioner/0_Docket Record.pdf',
          key: '69db2094-b50f-4fe5-9891-1c0b463792f3',
          useTempBucket: true,
        },
      ],
      onProgress: expect.anything(),
      outputZipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('does not check for missing files or throw an associated error if a file to be zipped does not exist in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    const errorCall =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0];
    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();
    expect(errorCall[0].message.error).toBeUndefined();
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockPetitionerUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error when batch downloading trial session with id 123 - Unauthorized',
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: expect.anything(),
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockPetitionerUser.userId,
    });
  });

  it('throws an unknown error if an error is thrown without a message', async () => {
    getCalendaredCasesForTrialSession.mockRejectedValueOnce(new Error());

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error when batch downloading trial session with id 123 - unknown error',
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: expect.anything(),
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockJudgeUser.userId,
    });
  });

  it('throws an NotFound error if a case does not exist', async () => {
    const mockTrialSessionId = '100-10';
    getTrialSessionById.mockResolvedValue(undefined);

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: mockTrialSessionId,
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Error when batch downloading trial session with id ${mockTrialSessionId} - Trial session ${mockTrialSessionId} was not found.`,
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: expect.anything(),
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockJudgeUser.userId,
    });
  });

  it('calls persistence functions to fetch trial sessions and associated cases and then zips their associated documents', async () => {
    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalled();
  });

  it('should filter closed cases from batch', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closed,
        isManuallyAdded: false,
        addedToSessionAt: '3000-03-01T00:00:00.000Z',
        removedFromTrial: false,
        isHearing: false,
      },
    ]);

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [],
      onProgress: expect.anything(),
      outputZipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('should filter removed cases from batch', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        ...MOCK_CASE,
        removedFromTrial: true,
        isManuallyAdded: false,
        addedToSessionAt: '3000-03-01T00:00:00.000Z',
        removedFromTrialDate: '3000-03-01T00:00:00.000Z',
        isHearing: false,
      },
    ]);

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [],
      onProgress: expect.anything(),
      outputZipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('should test batchDownloadTrialSessionInteractorHelper', async () => {
    pollAWSBatchProgress.mockImplementation(async ({ onProgress }) => {
      // Simulate progress by calling onProgress callback
      if (onProgress) {
        await onProgress({ totalFiles: 1, filesCompleted: 1 });
        await onProgress({ totalFiles: 1, filesCompleted: 1 });
      }
      // Return a completed job status
      return {
        jobName: 'testjob',
        jobId: 'jobid',
        jobQueue: '1234',
        startedAt: 0,
        jobDefinition: 'testjobdef',
        status: 'SUCCEEDED',
      };
    });

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockResolvedValueOnce({
        [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: 2,
      });

    applicationContext.environment.stage = 'not-local';

    applicationContext.getPersistenceGateway().uploadDocument = jest.fn();

    applicationContext.getDispatchers().sendZipperBatchJob = jest
      .fn()
      .mockResolvedValue({ jobId: '123' });

    applicationContext.getPersistenceGateway().zipDocuments = jest.fn();

    await batchDownloadTrialSessionInteractorHelper(
      applicationContext,
      { trialSessionId: 'test-123', clientConnectionId: 'abc-123' },
      mockJudgeUser,
    );

    expect(mockSendNotificationToUser).toHaveBeenCalledTimes(5);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalled();
  });
  it('should throw an error if AWS batch job fails to start', async () => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockResolvedValueOnce({
        [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: 2,
      });

    applicationContext.environment.stage = 'not-local';

    applicationContext.getPersistenceGateway().uploadDocument = jest.fn();

    const err = 'AWS batch job failed to start';

    applicationContext.getDispatchers().sendZipperBatchJob = jest
      .fn()
      .mockRejectedValue(new Error(err));

    await expect(
      batchDownloadTrialSessionInteractorHelper(
        applicationContext,
        { trialSessionId: 'test-123', clientConnectionId: 'abc-123' },
        mockJudgeUser,
      ),
    ).rejects.toThrow(`Error starting AWS batch job: Error: ${err}`);
  });

  it('should not send error notification when authorizedUser has no userId', async () => {
    const userWithNoId = { ...mockJudgeUser, userId: undefined };

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      userWithNoId as any,
    );

    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({
          action: 'batch_download_error',
        }),
      }),
    );
  });

  it('should skip docket entries that have no docketEntryId', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        ...mockCase,
        docketEntries: [
          {
            documentTitle: 'entry without id',
            documentType: 'Stipulated Decision',
            entityName: 'DocketEntry',
            eventCode: 'SDEC',
            filingDate: '2018-03-01T00:03:00.000Z',
            index: 1,
            isDraft: false,
            isFileAttached: true,
            isOnDocketRecord: true,
            userId: 'abc-123',
            // docketEntryId is undefined
          },
        ],
      },
    ]);

    await batchDownloadTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '123',
        clientConnectionId: 'abc-123',
      },
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [
        {
          filePathInZip: '101-18, Test Petitioner/0_Docket Record.pdf',
          key: '69db2094-b50f-4fe5-9891-1c0b463792f3',
          useTempBucket: true,
        },
      ],
      onProgress: expect.anything(),
      outputZipName: 'September_26_2019-Birmingham.zip',
    });
  });
});
