import { CASE_STATUS_TYPES, ROLES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  batchDownloadTrialSessionInteractor,
  generateValidDocketEntryFilename,
} from './batchDownloadTrialSessionInteractor';

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
        '9de27a7d-7c6b-434b-803b-7655f82d5e07',
        '25ae8e71-9dc4-40c6-bece-89acb974a82e',
      ],
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });

  it('does not check for missing files or throw an associated error if a file to be zipped does not exist in persistence', async () => {
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

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error when batch downloading trial session with id 123 - Unauthorized',
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

  it('throws an unknown error if an error is thrown without a message', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockRejectedValueOnce(new Error());

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: '123',
    });

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error when batch downloading trial session with id 123 - unknown error',
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

  it('throws an NotFound error if a case does not exist', async () => {
    const mockTrialSessionId = '100-10';
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(false);

    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId: mockTrialSessionId,
    });

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Error when batch downloading trial session with id ${mockTrialSessionId} - Trial session ${mockTrialSessionId} was not found.`,
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
      zipName: 'September_26_2019-Birmingham.zip',
    });
  });
});
