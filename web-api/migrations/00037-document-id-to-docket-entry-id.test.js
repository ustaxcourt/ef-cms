const { forAllRecords } = require('./utilities');
const { up } = require('./00037-document-id-to-docket-entry-id');

describe('docket entry documentId -> docketEntryId', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const DOCUMENT_ID = 'cdf86221-71eb-44ca-a445-522c9c754838';
  const PREVIOUS_DOCUMENT_ID = 'affcadb2-4208-4129-8ed4-d55fb4a0b286';

  const validDocketEntry = {
    documentId: DOCUMENT_ID,
    documentType: 'Answer',
    entityName: 'DocketEntry',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    judge: 'Chief Judge',
    previousDocument: {
      documentId: PREVIOUS_DOCUMENT_ID,
      documentTitle: 'Petition',
    },
    userId: 'e5c275c9-bd0f-4c96-ba36-5b4136317d0a',
  };

  const mockDocketEntryRecord = {
    ...validDocketEntry,
    pk: 'case|101-20',
    sk: `docket-entry|${DOCUMENT_ID}`,
  };

  beforeEach(() => {
    mockItems = [mockDocketEntryRecord];
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

  it('should not modify records that are NOT docket entry records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should set docketEntryId to the existing documentId for a docket entry', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].docketEntryId).toEqual(DOCUMENT_ID);
  });

  it('should set docketEntryId for a previousDocument within a docket entry', async () => {
    await up(documentClient, '', forAllRecords);

    expect(
      putStub.mock.calls[0][0]['Item'].previousDocument.docketEntryId,
    ).toEqual(PREVIOUS_DOCUMENT_ID);
  });
});
