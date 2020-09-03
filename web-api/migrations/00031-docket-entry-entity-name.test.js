const { forAllRecords } = require('./utilities');
const { up } = require('./00031-docket-entry-entity-name');

describe('update entity name on document records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const validDocument = {
    documentId: 'feb6e9d6-8163-40b0-89ae-5adb158ddd78',
    documentType: 'Answer',
    entityName: 'Document',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    judge: 'Chief Judge',
    userId: 'e5c275c9-bd0f-4c96-ba36-5b4136317d0a',
  };

  const mockDocumentRecord = {
    ...validDocument,
    pk: 'case|101-20',
    sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
  };

  beforeEach(() => {
    mockItems = [mockDocumentRecord];
  });

  beforeAll(() => {
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
        Item: {},
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT document records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records that are document records with the updated entityName', async () => {
    mockItems = [
      {
        ...validDocument,
        entityName: 'DocketEntry',
        pk: 'case|101-20',
        sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('updates the entity name to DocketEntry for document records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].entityName).toEqual('DocketEntry');
  });
});
