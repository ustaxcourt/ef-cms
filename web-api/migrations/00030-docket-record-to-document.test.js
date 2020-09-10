const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00030-docket-record-to-document');

describe('merge docket record records into document records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let queryStub;
  let mockItems = [];

  const DOCUMENT_ID_1 = '2ffd0350-65a3-4aea-a395-4a9665a05d91';
  const DOCUMENT_ID_2 = '2bcb652e-75ce-4308-b461-8fa391d372a9';
  const DOCUMENT_ID_3 = '4116b850-eb4d-435e-8758-406e431969ad';
  const DOCKET_RECORD_ID_1 = 'a6957cea-33cf-43b6-a5f8-27459191306f';
  const DOCKET_RECORD_ID_2 = '10d919cd-129c-48ea-b99b-da356cefaaa5';
  const DOCKET_RECORD_ID_3 = '6e3d3bd0-9ca6-463b-8a24-2722fdf9d90e';
  const USER_ID = '411a505c-adb9-48d1-a495-7d3b9768fe7c';

  const validDocument = {
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    judge: 'Chief Judge',
    userId: USER_ID,
  };

  const mockCaseRecord = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `case|${MOCK_CASE.docketNumber}`,
  };

  const mockDocumentRecord1 = {
    ...validDocument,
    documentId: DOCUMENT_ID_1,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `document|${DOCUMENT_ID_1}`,
  };
  const mockDocumentRecord2 = {
    ...validDocument,
    documentId: 'f08d3f2c-4a5e-49da-a576-9446ece30d41',
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: 'document|f08d3f2c-4a5e-49da-a576-9446ece30d41',
  };

  const mockDocketRecord1 = {
    docketRecordId: DOCKET_RECORD_ID_1,
    documentId: DOCUMENT_ID_1,
    index: 1,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `docket-record|${DOCKET_RECORD_ID_1}`,
  };
  const mockDocketRecord2 = {
    description: 'Request for Place of Trial at Boise, Idaho',
    docketRecordId: DOCKET_RECORD_ID_2,
    documentId: DOCUMENT_ID_2,
    eventCode: 'RQT',
    index: 2,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `docket-record|${DOCKET_RECORD_ID_2}`,
  };
  const mockDocketRecord3 = {
    description: 'first record',
    docketRecordId: DOCKET_RECORD_ID_3,
    documentId: DOCUMENT_ID_3,
    entityName: 'DocketRecord',
    eventCode: 'P',
    filingDate: '2018-03-01T00:01:00.000Z',
    index: 3,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `docket-record|${DOCKET_RECORD_ID_3}`,
  };
  beforeEach(() => {
    mockItems = [
      mockCaseRecord,
      mockDocumentRecord1,
      mockDocumentRecord2,
      mockDocketRecord1,
      mockDocketRecord2,
      mockDocketRecord3,
    ];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    deleteStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    documentClient = {
      delete: deleteStub,
      put: putStub,
      query: queryStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT case records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records if a full case record is not found', async () => {
    documentClient.query = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should modify case records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toBeCalledTimes(3);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      index: 1,
      isOnDocketRecord: true,
      sk: `document|${DOCUMENT_ID_1}`,
    });
    expect(putStub.mock.calls[1][0].Item).toMatchObject({
      documentTitle: 'Request for Place of Trial at Boise, Idaho',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      index: 2,
      isFileAttached: false,
      isMinuteEntry: true,
      isOnDocketRecord: true,
      processingStatus: 'complete',
      sk: `document|${DOCUMENT_ID_2}`,
      userId: MOCK_CASE.userId,
    });
    expect(putStub.mock.calls[2][0].Item).toMatchObject({
      documentTitle: 'first record',
      documentType: 'Petition',
      eventCode: 'P',
      filedBy: 'Migrated',
      index: 3,
      isFileAttached: false,
      isMinuteEntry: true,
      isOnDocketRecord: true,
      processingStatus: 'complete',
      sk: `document|${DOCUMENT_ID_3}`,
      userId: MOCK_CASE.userId,
    });

    expect(deleteStub).toBeCalledTimes(3);
    expect(deleteStub.mock.calls[0][0].Key).toMatchObject({
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-record|${DOCKET_RECORD_ID_1}`,
    });
    expect(deleteStub.mock.calls[1][0].Key).toMatchObject({
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-record|${DOCKET_RECORD_ID_2}`,
    });
    expect(deleteStub.mock.calls[2][0].Key).toMatchObject({
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-record|${DOCKET_RECORD_ID_3}`,
    });
  });
});
