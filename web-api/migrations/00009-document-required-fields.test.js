const { forAllRecords } = require('./utilities');
const { up } = require('./00009-document-required-fields');

describe('document required fields test', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;

  let mockDocumentItemWithOnlyServedAt;
  let mockDocumentItemWithOnlyServedParties;
  let mockDocumentItemNotServed;
  let mockDocumentItemServed;
  let mockItems = {};

  beforeEach(() => {
    mockItems = {
      notServed: { ...mockDocumentItemNotServed },
      scanList: [
        {
          ...mockDocumentItemWithOnlyServedAt,
          pk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          sk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        },
        { ...mockDocumentItemWithOnlyServedAt },
        { ...mockDocumentItemWithOnlyServedParties },
        { ...mockDocumentItemServed },
        { ...mockDocumentItemNotServed },
      ],
      served: { ...mockDocumentItemServed },
      servedAt: { ...mockDocumentItemWithOnlyServedAt },
      servedParties: { ...mockDocumentItemWithOnlyServedParties },
    };
  });

  beforeAll(() => {
    mockDocumentItemWithOnlyServedAt = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Petition',
      documentType: 'Petition',
      eventCode: 'P',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      processingStatus: 'pending',
      servedAt: '2018-11-21T20:49:28.192Z',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [],
    };

    mockDocumentItemWithOnlyServedParties = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Petition',
      documentType: 'Petition',
      eventCode: 'P',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      processingStatus: 'pending',
      servedParties: [{ name: 'Test Petitioner' }],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [],
    };

    mockDocumentItemNotServed = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Petition',
      documentType: 'Petition',
      eventCode: 'P',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      processingStatus: 'pending',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [],
    };

    mockDocumentItemServed = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Petition',
      documentType: 'Petition',
      eventCode: 'P',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      processingStatus: 'pending',
      servedAt: '2018-11-21T20:49:28.192Z',
      servedParties: [{ name: 'Test Petitioner' }],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [],
    };

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems.scanList,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: mockItems.scanList,
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it.only('does not mutate non document records', async () => {
    await up(documentClient, '', forAllRecords);

    //have a pair of expect statements for mock calls [0] to be something
    expect(putStub.mock.calls[0]).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
    });
    // expect(putStub).toHaveBeenCalledWith(mockItems.scanList[0]);
  });

  it('does not mutate document records that have not been served', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toHaveBeenCalled();
  });

  it('does not mutate document records that have both servedAt and servedParties fields defined', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toHaveBeenCalled();
  });

  it('mutates document records that have a defined servedAt field when servedParties is undefined', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      ...mockItems.scanList[1],
      servedParties: [
        {
          name: 'Served via migration.',
        },
      ],
    });
  });
});
