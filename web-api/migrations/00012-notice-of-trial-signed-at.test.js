const { forAllRecords } = require('./utilities');
const { up } = require('./00012-notice-of-trial-signed-at');

describe('require signedAt for NTD', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const documents = [
    // Non NTD Item (should not mutate)
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      documentType: 'Order',
      eventCode: 'O',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      servedParties: [],
      sk: 'document|1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
    // Already signed NTD (should not mutate)
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '2079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      servedAt: '2019-03-01T21:40:46.415Z',
      servedParties: [],
      signedAt: '2019-03-01T21:40:46.415Z',
      sk: 'document|2079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
    // Un-served NTD (should not mutate)
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      servedParties: [],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
    // Served NTD without signedAt (should mutate)
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '4079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      servedAt: '2019-03-01T21:40:46.415Z',
      servedParties: [],
      sk: 'document|4079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
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

  it('only mutates NTD documents that have been served but do not have a signedAt', async () => {
    await up(documentClient, '', forAllRecords);

    const mutatedObject = putStub.mock.calls[0][0]['Item'];

    // Non NTD Item
    expect(mutatedObject).not.toMatchObject(documents[0]);
    // Already signed NTD
    expect(mutatedObject).not.toMatchObject(documents[1]);
    // Un-served NTD
    expect(mutatedObject).not.toMatchObject(documents[2]);
    // Served NTD without signedAt
    expect(mutatedObject).toMatchObject(documents[3]);
    expect(mutatedObject.signedAt).toBeTruthy();
  });
});
