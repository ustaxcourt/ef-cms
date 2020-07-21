const { forAllRecords } = require('./utilities');
const { up } = require('./00010-document-misl-event-code');

describe('document MISL event code migration', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems;

  const baseDocument = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketNumber: '101-18',
    documentId: '2d54c3a1-f451-4551-a53d-9865abc359cf',
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
    filedBy: 'Test Petitioner',
    pk: 'case|24e7c03d-0335-460b-b557-b55ca11d496a',
    processingStatus: 'pending',
    servedAt: '2018-11-21T20:49:28.192Z',
    servedParties: [{ name: 'Test Petitioner' }],
    sk: 'document|2d54c3a1-f451-4551-a53d-9865abc359cf',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    workItems: [],
  };

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

  it('does not mutate non document records', async () => {
    mockItems = [
      {
        ...baseDocument,
        pk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('does not mutate document records that do not have MISL event code', async () => {
    mockItems = [{ ...baseDocument }];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('sets document event code from event code list for external document', async () => {
    mockItems = [
      {
        ...baseDocument,
        documentType: 'Administrative Record',
        eventCode: 'MISL',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      eventCode: 'ADMR',
    });
  });

  it('sets document event code from event code list for internal document', async () => {
    mockItems = [
      {
        ...baseDocument,
        documentType: 'Bond',
        eventCode: 'MISL',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      eventCode: 'BND',
    });
  });
});
