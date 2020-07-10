const {
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { omit } = require('lodash');
const { up } = require('./00011-document-required-filed-by-fields');

describe('document required fields test', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;

  let mockExternalDocumentWithoutFiledBy;
  let mockExternalDocumentWithFiledBy;
  let mockInternalDocumentWithoutFiledBy;
  let mockInternalDocumentWithFiledBy;
  let mockDocumentFiledByNotRequired;
  let mockItems = {};

  beforeEach(() => {
    const notADocument = {
      ...omit(mockExternalDocumentWithFiledBy, 'filedBy'),
      pk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'not-a-document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
    };

    mockItems = {
      scanList: [
        { ...notADocument },
        { ...mockExternalDocumentWithoutFiledBy },
        { ...mockExternalDocumentWithFiledBy },
        { ...mockInternalDocumentWithoutFiledBy },
        { ...mockInternalDocumentWithFiledBy },
        { ...mockDocumentFiledByNotRequired },
      ],
    };
  });

  beforeAll(() => {
    mockExternalDocumentWithoutFiledBy = {
      ...omit(MOCK_DOCUMENTS[0], 'filedBy'),
      documentType: EXTERNAL_DOCUMENT_TYPES[0],
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
    };

    mockInternalDocumentWithoutFiledBy = {
      ...omit(MOCK_DOCUMENTS[0], 'filedBy'),
      documentType: INTERNAL_DOCUMENT_TYPES[0],
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
    };

    mockExternalDocumentWithFiledBy = {
      ...MOCK_DOCUMENTS[0],
      documentType: EXTERNAL_DOCUMENT_TYPES[0],
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
    };

    mockInternalDocumentWithFiledBy = {
      ...MOCK_DOCUMENTS[0],
      documentType: INTERNAL_DOCUMENT_TYPES[0],
      filedBy: 'Test Petitioner',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
    };

    mockDocumentFiledByNotRequired = {
      ...MOCK_DOCUMENTS[1],
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
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
    // mockInternalDocumentWithoutFiledBy
    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
    });
  });

  it('does not mutate document records that are external when filedBy is defined', async () => {
    await up(documentClient, '', forAllRecords);

    // mockExternalDocumentWithFiledBy
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a3',
    });
  });

  it('does not mutate document records that are internal when filedBy is defined', async () => {
    await up(documentClient, '', forAllRecords);

    // mockInternalDocumentWithFiledBy
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a31',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
    });
  });

  it('does mutate external document records when filedBy is undefined and it is required for that documentType', async () => {
    await up(documentClient, '', forAllRecords);

    // mockExternalDocumentWithoutFiledBy
    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
    });
  });

  it('does mutate internal document records when filedBy is undefined and it is required for that documentType', async () => {
    await up(documentClient, '', forAllRecords);

    // mockInternalDocumentWithoutFiledBy
    expect(putStub.mock.calls[1][0]['Item']).toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a2',
    });
  });

  it('does not mutate document records when filedBy is undefined and it is not required for that documentType', async () => {
    await up(documentClient, '', forAllRecords);
    //     mockDocumentFiledByNotRequired
    expect(putStub.mock.calls[0][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
    });
    expect(putStub.mock.calls[1][0]['Item']).not.toMatchObject({
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
      sk: 'document|3079c990-cc6c-4b99-8fca-8e31f2d9e7a6',
    });
  });
});
