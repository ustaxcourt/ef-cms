import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  ATP_DOCKET_ENTRY,
  MOCK_DOCUMENTS,
  MOCK_MINUTE_ENTRY,
  STANDING_PRETRIAL_ORDER_ENTRY,
} from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { batchDownloadDocketEntriesInteractor } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import {
  mockDocketClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';

jest.mock('@web-api/dispatchers/batch/pollAWSBatchProgress');
import { pollAWSBatchProgress as mockPollAWSBatchProgress } from '@web-api/dispatchers/batch/pollAWSBatchProgress';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

describe('batchDownloadDocketEntriesInteractor', () => {
  const MOCK_URL = 'document_url_containing_id';
  const mockClientConnectionId = '987654';
  const PETITION_DOCKET_ENTRY = MOCK_DOCUMENTS[0];

  const mockDocketEntries = [
    PETITION_DOCKET_ENTRY,
    ATP_DOCKET_ENTRY,
    MOCK_MINUTE_ENTRY,
    STANDING_PRETRIAL_ORDER_ENTRY,
  ];

  const mockDocumentsSelectedForDownload: string[] = [
    PETITION_DOCKET_ENTRY.docketEntryId,
    ATP_DOCKET_ENTRY.docketEntryId,
    STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
  ];

  let requestParams: {
    clientConnectionId: string;
    docketNumber: string;
    documentsSelectedForDownload: string[];
    printableDocketRecordFileId?: string;
  };

  const mockSendNotificationToUser = jest.fn();

  const pollAWSBatchProgress = jest.mocked(mockPollAWSBatchProgress);

  beforeAll(() => {
    applicationContext.getNotificationGateway().sendNotificationToUser =
      mockSendNotificationToUser;
  });

  beforeEach(() => {
    requestParams = {
      clientConnectionId: mockClientConnectionId,
      docketNumber: MOCK_CASE.docketNumber,
      documentsSelectedForDownload: mockDocumentsSelectedForDownload,
    };
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketEntries: mockDocketEntries,
    });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: MOCK_URL,
      });

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue('pdf data');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockPrivatePractitionerUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error batch-downloading documents from case: 101-18 - Unauthorized',
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockClientConnectionId,
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockPrivatePractitionerUser.userId,
    });
  });

  it('throws an unknown error if an error is thrown without a message', async () => {
    requestParams.printableDocketRecordFileId = '1234567';

    getCaseByDocketNumber.mockRejectedValueOnce(new Error());

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Error batch-downloading documents from case: 101-18 - unknown error',
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockClientConnectionId,
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockDocketClerkUser.userId,
    });
  });

  it('throws an NotFound error if a case does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue(false);

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Error batch-downloading documents from case: ${requestParams.docketNumber} - Case: ${requestParams.docketNumber} was not found.`,
      expect.anything(),
    );
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockClientConnectionId,
      message: {
        action: 'batch_download_error',
        error: expect.anything(),
      },
      userId: mockDocketClerkUser.userId,
    });
  });

  it('should NOT a add the printable docket record with the list of case documents from persistence', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [
        {
          filePathInZip: '101-18, Test Petitioner/2018-03-01_0001_Petition.pdf',
          key: PETITION_DOCKET_ENTRY.docketEntryId,
          useTempBucket: false,
        },
        {
          filePathInZip:
            '101-18, Test Petitioner/2017-03-01_0004_Attachment to Petition.pdf',
          key: ATP_DOCKET_ENTRY.docketEntryId,
          useTempBucket: false,
        },
        {
          filePathInZip:
            '101-18, Test Petitioner/2023-08-15_0006_Standing Pretrial Order.pdf',
          key: STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
          useTempBucket: false,
        },
      ],
      onProgress: expect.anything(),
      outputZipName: '101-18, Test Petitioner.zip',
    });
  });

  it('should add the printable docket record with the list of case documents from persistence', async () => {
    requestParams.printableDocketRecordFileId = '1234567';

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith(expect.anything(), {
      documents: [
        {
          filePathInZip: '101-18, Test Petitioner/2018-03-01_0001_Petition.pdf',
          key: PETITION_DOCKET_ENTRY.docketEntryId,
          useTempBucket: false,
        },
        {
          filePathInZip:
            '101-18, Test Petitioner/2017-03-01_0004_Attachment to Petition.pdf',
          key: ATP_DOCKET_ENTRY.docketEntryId,
          useTempBucket: false,
        },
        {
          filePathInZip:
            '101-18, Test Petitioner/2023-08-15_0006_Standing Pretrial Order.pdf',
          key: STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
          useTempBucket: false,
        },
        {
          filePathInZip: '101-18, Test Petitioner/0_Docket_Record.pdf',
          key: requestParams.printableDocketRecordFileId,
          useTempBucket: true,
        },
      ],
      onProgress: expect.anything(),
      outputZipName: '101-18, Test Petitioner.zip',
    });
  });

  it('returns a url with the document id of the zipped files via websocket', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockClientConnectionId,
      message: {
        action: 'batch_download_ready',
        url: MOCK_URL,
      },
      userId: mockDocketClerkUser.userId,
    });
  });

  it('should test batchDownloadDocketEntriesHelper', async () => {
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

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
      mockDocketClerkUser,
    );

    expect(mockSendNotificationToUser).toHaveBeenCalledTimes(2);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalled();
  });
});
