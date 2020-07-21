const { forAllRecords } = require('./utilities');
const { up } = require('./00013-is-file-attached');

describe('require isFileAttached on documents', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const documents = [
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      documentType: 'Order',
      draftState: {},
      eventCode: 'O',
      isDraft: true,
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      documentType: 'Order',
      draftState: {},
      eventCode: 'O',
      isDraft: true,
      isFileAttached: false,
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      documentType: 'Order',
      draftState: {},
      eventCode: 'O',
      isDraft: true,
      isFileAttached: true,
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
  ];

  beforeEach(() => {
    mockItems = [...documents];
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

  it('adds true or false to all records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].isFileAttached).toEqual(true);
    expect(putStub.mock.calls[1][0]['Item'].isFileAttached).toEqual(false);
    expect(putStub.mock.calls[2][0]['Item'].isFileAttached).toEqual(true);
  });
});
