import {
  ATP_DOCKET_ENTRY,
  MOCK_DOCUMENTS,
  MOCK_MINUTE_ENTRY,
} from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { batchDownloadDocketEntriesInteractor } from '@shared/business/useCases/document/batchDownloadDocketEntriesInteractor';

describe('batchDownloadDocketEntriesInteractor', () => {
  let user;

  const MOCK_URL = 'document_url_containing_id';
  const mockClientConnectionId = '987654';
  const PETITION_DOCUMENT = MOCK_DOCUMENTS[0];
  const ORDER_DOCUMENT = {
    docketEntryId: '25ae8e71-9dc4-40c6-bece-89acb974a82e',
    documentTitle: 'Order',
    documentType: 'Order',
    entityName: 'DocketEntry',
    eventCode: 'O',
    filingDate: '2018-03-01T00:03:00.000Z',
    index: 2,
    isDraft: false,
    isFileAttached: true,
    isMinuteEntry: false,
    isOnDocketRecord: true,
    userId: 'abc-123',
  };
  const mockDocketEntries = [
    PETITION_DOCUMENT,
    ATP_DOCKET_ENTRY,
    MOCK_MINUTE_ENTRY,
    ORDER_DOCUMENT,
  ];

  const mockDocumentsSelectedForDownload: string[] = [
    PETITION_DOCUMENT.docketEntryId,
    ATP_DOCKET_ENTRY.docketEntryId,
    ORDER_DOCUMENT.docketEntryId,
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
        '9de27a7d-7c6b-434b-803b-7655f82d5e07',
        '062c9a5d-1a65-4273-965e-25d41607bc98',
        '25ae8e71-9dc4-40c6-bece-89acb974a82e',
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
        '9de27a7d-7c6b-434b-803b-7655f82d5e07',
        '062c9a5d-1a65-4273-965e-25d41607bc98',
        '25ae8e71-9dc4-40c6-bece-89acb974a82e',
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
      message: {
        action: 'batch_download_ready',
        url: MOCK_URL,
      },
      userId: user.userId,
    });
  });
});
