import { ATP_DOCKET_ENTRY, MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { DOCKET_RECORD_FILTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('batchDownloadDocketEntriesAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  let sessionMetadata: {
    docketRecordFilter: string;
  };

  const clientConnectionId = '987654';

  const fileId = '12345';
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
    ORDER_DOCUMENT,
  ];

  const caseDetail = {
    docketEntries: mockDocketEntries,
    docketNumber: MOCK_CASE.docketNumber,
  };

  const documentsSelectedForDownload: { docketEntryId: string }[] = [
    { docketEntryId: PETITION_DOCUMENT.docketEntryId },
    { docketEntryId: ATP_DOCKET_ENTRY.docketEntryId },
    { docketEntryId: ORDER_DOCUMENT.docketEntryId },
  ];

  beforeEach(() => {
    sessionMetadata = {
      docketRecordFilter: 'All documents',
    };
  });

  it('should call the error path to open a modal when an error occurs when downloading case documents', async () => {
    applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor.mockRejectedValueOnce(
        new Error('something bad happened'),
      );

    await runAction(batchDownloadDocketEntriesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        clientConnectionId,
        documentsSelectedForDownload,
        sessionMetadata,
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      showModal: 'FileCompressionErrorModal',
    });
  });
  it('should make a call to persistence to batch-download ALL eligible documents selected documents from a case', async () => {
    await runAction(batchDownloadDocketEntriesAction, {
      modules: {
        presenter,
      },
      props: { fileId },
      state: {
        caseDetail,
        clientConnectionId,
        documentsSelectedForDownload,
        sessionMetadata,
      },
    });

    expect(
      applicationContext.getUseCases().batchDownloadDocketEntriesInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      clientConnectionId,
      docketNumber: MOCK_CASE.docketNumber,
      documentsSelectedForDownload: [
        PETITION_DOCUMENT.docketEntryId,
        ATP_DOCKET_ENTRY.docketEntryId,
        ORDER_DOCUMENT.docketEntryId,
      ],
      printableDocketRecordFileId: '12345',
    });
    expect(pathSuccessStub).toHaveBeenCalled();
  });
  it('should make a call to persistence to batch-download only the documents filtered by document type', async () => {
    sessionMetadata.docketRecordFilter = DOCKET_RECORD_FILTER_OPTIONS.orders;

    await runAction(batchDownloadDocketEntriesAction, {
      modules: {
        presenter,
      },
      props: { fileId },
      state: {
        caseDetail,
        clientConnectionId,
        documentsSelectedForDownload,
        sessionMetadata,
      },
    });

    expect(
      applicationContext.getUseCases().batchDownloadDocketEntriesInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      clientConnectionId,
      docketNumber: MOCK_CASE.docketNumber,
      documentsSelectedForDownload: [ORDER_DOCUMENT.docketEntryId],
      printableDocketRecordFileId: '12345',
    });
    expect(pathSuccessStub).toHaveBeenCalled();
  });
});
