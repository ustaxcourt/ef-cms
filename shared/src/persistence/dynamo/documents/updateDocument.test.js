const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateDocument } = require('./updateDocument');

const mockDocumentId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockDocketNumber = '101-20';

const mockDocument = {
  documentId: mockDocumentId,
  documentTitle: 'Title of le Document',
  filedBy: 'The one and only, Guy Fieri',
  status: 'complete',
};

describe('updateDocument', () => {
  it('makes put request with the given document data for the matching document id', async () => {
    await updateDocument({
      applicationContext,
      docketNumber: mockDocketNumber,
      document: mockDocument,
      documentId: mockDocumentId,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `case|${mockDocketNumber}`,
        sk: `docket-entry|${mockDocumentId}`,
        ...mockDocument,
      },
    });
  });
});
