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

  const mockDocumentsSelectedForDownload = mockDocketEntries.map(
    docEntry => docEntry.docketEntryId,
  );

  const requestParams = {
    clientConnectionId: mockClientConnectionId,
    docketNumber: MOCK_CASE.docketNumber,
    documentsSelectedForDownload: mockDocumentsSelectedForDownload,
    printableDocketRecordFileId: '1234567',
  };

  beforeEach(() => {
    user = {
      role: ROLES.judge,
      userId: 'abc-123',
    };
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        MOCK_CASE,
        docketEntries: mockDocketEntries,
      });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'something' });

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue('pdf data');
  });
  it('should not a add the printable docket record with the list of case documents from persistence', async () => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      requestParams,
    );

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
});
