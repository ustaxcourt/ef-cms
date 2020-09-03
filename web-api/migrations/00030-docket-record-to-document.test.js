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

  beforeEach(() => {
    mockItems = [mockCaseRecord, mockDocumentRecord1, mockDocumentRecord2];

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

  it('should not modify case records since there is no longer a docketRecord', async () => {
    documentClient.scan = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseRecord, mockDocumentRecord1, mockDocumentRecord2],
      }),
    });
    documentClient.query = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseRecord, mockDocumentRecord1, mockDocumentRecord2],
      }),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).toBeCalledTimes(0);
    expect(deleteStub).toBeCalledTimes(0);
  });
});
