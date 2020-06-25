const {
  EXTERNAL_DOCUMENT_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
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
  let mockExternalDocumentNotFiledBy;
  let mockExternalDocumentWithFiledBy;
  let mockItems = {};

  beforeEach(() => {
    const notADocument = {
      ...mockDocumentItemWithOnlyServedAt,
      pk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
    };

    mockItems = {
      scanList: [
        { ...notADocument },
        { ...mockDocumentItemWithOnlyServedAt },
        { ...mockDocumentItemWithOnlyServedParties },
        { ...mockDocumentItemServed },
        { ...mockDocumentItemNotServed },
        { ...mockExternalDocumentNotFiledBy },
        { ...mockExternalDocumentWithFiledBy },
      ],
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
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      processingStatus: 'pending',
      servedAt: '2018-11-21T20:49:28.192Z',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
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
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
      processingStatus: 'pending',
      servedParties: [{ name: 'Test Petitioner' }],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
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
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      processingStatus: 'pending',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
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
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a5',
      processingStatus: 'pending',
      servedAt: '2018-11-21T20:49:28.192Z',
      servedParties: [{ name: 'Test Petitioner' }],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a5',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [],
    };

    mockExternalDocumentNotFiledBy = {
      ...mockDocumentItemServed,
      documentType: EXTERNAL_DOCUMENT_TYPES[0],
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
    };
    mockExternalDocumentWithFiledBy = {
      ...mockDocumentItemServed,
      documentType: EXTERNAL_DOCUMENT_TYPES[0],
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
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
    await up(documentClient, '', forAllRecords);

    // notADocument
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
    });
    // mockDocumentItemWithOnlyServedAt
    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
    });
  });

  it('does not mutate document records that have not been served and are not external', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(4);
    // mockDocumentItemNotServed
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
    });
    // mockDocumentItemWithOnlyServedParties
    expect(putStub.mock.calls[1][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
    });
  });

  it('does not mutate document records that have not been served and are external when filedBy is defined', async () => {
    await up(documentClient, '', forAllRecords);

    // mockExternalDocumentWithFiledBy
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
    });
  });

  it('does mutate document records that are external when filedBy is undefined', async () => {
    await up(documentClient, '', forAllRecords);

    // mockExternalDocumentNotFiledBy
    expect(putStub.mock.calls[2][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
    });
  });

  it('does not mutate internal document records that have both servedAt and servedParties fields defined', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(4);
    // mockDocumentItemServed
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
    });
    // mockDocumentItemWithOnlyServedParties
    expect(putStub.mock.calls[1][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
    });
  });

  it('mutates document records that have a defined servedAt field when servedParties is undefined', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(4);
    // mockDocumentItemWithOnlyServedParties
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
    });
    // mockDocumentItemWithOnlyServedAt
    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      servedParties: [
        {
          name: 'Served via migration.',
        },
      ],
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
    });
  });

  it('mutates document records that have a defined servedParties field when servedAt is undefined', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(4);
    // mockDocumentItemWithOnlyServedAt
    expect(putStub.mock.calls[1][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
    });
    // mockDocumentItemWithOnlyServedParties
    expect(putStub.mock.calls[1][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
      servedAt: expect.anything(),
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a7',
    });
  });
});
