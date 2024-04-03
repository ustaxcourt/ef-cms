import {
  ATP_DOCKET_ENTRY,
  MOCK_DOCUMENTS,
  MOCK_MINUTE_ENTRY,
  STANDING_PRETRIAL_ORDER_ENTRY,
} from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { batchDownloadDocketEntriesInteractor } from '@shared/business/useCases/document/batchDownloadDocketEntriesInteractor';

describe('batchDownloadDocketEntriesInteractor', () => {
  let user;

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

  beforeEach(() => {
    user = {
      role: ROLES.docketClerk,
      userId: 'abc-123',
    };

    requestParams = {
      clientConnectionId: mockClientConnectionId,
      docketNumber: MOCK_CASE.docketNumber,
      documentsSelectedForDownload: mockDocumentsSelectedForDownload,
    };
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
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

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    user = {
      role: ROLES.privatePractitioner,
      userId: 'abc-456',
    };
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
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
      userId: 'abc-456',
    });
  });

  it('throws an unknown error if an error is thrown without a message', async () => {
    requestParams.printableDocketRecordFileId = '1234567';

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValueOnce(new Error());

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
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
      userId: 'abc-123',
    });
  });

  it('throws an NotFound error if a case does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(false);

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
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
      userId: 'abc-123',
    });
  });

  it('should NOT a add the printable docket record with the list of case documents from persistence', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      extraFileNames: [],
      extraFiles: [],
      fileNames: expect.anything(),
      onEntry: expect.anything(),
      onError: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [
        PETITION_DOCKET_ENTRY.docketEntryId,
        ATP_DOCKET_ENTRY.docketEntryId,
        STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
      ],
      zipName: '101-18, Test Petitioner.zip',
    });
  });

  it('should a add the printable docket record with the list of case documents from persistence', async () => {
    requestParams.printableDocketRecordFileId = '1234567';

    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
    );

    expect(
      applicationContext.getPersistenceGateway().zipDocuments,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      extraFileNames: ['101-18, Test Petitioner/0_Docket_Record.pdf'],
      extraFiles: ['pdf data'],
      fileNames: expect.anything(),
      onEntry: expect.anything(),
      onError: expect.anything(),
      onProgress: expect.anything(),
      onUploadStart: expect.anything(),
      s3Ids: [
        PETITION_DOCKET_ENTRY.docketEntryId,
        ATP_DOCKET_ENTRY.docketEntryId,
        STANDING_PRETRIAL_ORDER_ENTRY.docketEntryId,
      ],
      zipName: '101-18, Test Petitioner.zip',
    });
  });

  it('returns a url with the document id of the zipped files via websocket', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
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
      userId: user.userId,
    });
  });
});
