const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00020-case-records');

describe('use docketNumber instead of caseId for case records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let queryStub;
  let mockItems = [];
  MOCK_CASE.caseId = 'f9b77e8a-3515-469d-83b0-a62f07dd9cf1';

  const mockCaseRecord = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.caseId}`,
    sk: `case|${MOCK_CASE.caseId}`,
  };

  const mockDocumentRecord = {
    documentId: '2ffd0350-65a3-4aea-a395-4a9665a05d91',
    pk: `case|${MOCK_CASE.caseId}`,
    sk: 'document|2ffd0350-65a3-4aea-a395-4a9665a05d91',
  };

  const mockUserCaseRecord = {
    gsi1pk: `user-case|${MOCK_CASE.caseId}`,
    pk: 'user|b0baec36-8954-403e-8ff0-929e082b5e61',
    sk: `case|${MOCK_CASE.caseId}`,
  };

  const mockCatalogRecord = {
    pk: 'catalog',
    sk: `case|${MOCK_CASE.caseId}`,
  };

  beforeEach(() => {
    mockItems = [
      mockCaseRecord,
      mockDocumentRecord,
      mockUserCaseRecord,
      mockCatalogRecord,
    ];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: mockCatalogRecord,
      }),
    });

    queryStub = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [mockCaseRecord, mockDocumentRecord],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [mockUserCaseRecord],
        }),
      });

    documentClient = {
      get: getStub,
      put: putStub,
      query: queryStub,
      scan: scanStub,
    };
  });

  it('should not call putStub if the record is not a case record', async () => {
    mockItems = [
      {
        pk: 'user|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'user|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not call putStub if the item does not have a caseId or docketNumber', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      },
    ];

    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should call putStub to modify each case record', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(4);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    });
    expect(putStub.mock.calls[1][0].Item).toMatchObject({
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'document|2ffd0350-65a3-4aea-a395-4a9665a05d91',
    });
    expect(putStub.mock.calls[2][0].Item).toMatchObject({
      gsi1pk: `user-case|${MOCK_CASE.docketNumber}`,
      pk: 'user|b0baec36-8954-403e-8ff0-929e082b5e61',
      sk: `case|${MOCK_CASE.docketNumber}`,
    });
    expect(putStub.mock.calls[3][0].Item).toMatchObject({
      pk: 'catalog',
      sk: `case|${MOCK_CASE.docketNumber}`,
    });
  });
});
