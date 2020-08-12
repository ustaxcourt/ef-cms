const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteDocument } = require('./deleteDocument');

const mockDocumentId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockDocketNumber = '999-99';

describe('deleteDocument', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    client.delete = jest.fn();
  });

  it('makes a delete request with the given document data for the matching document id', async () => {
    await deleteDocument({
      applicationContext,
      docketNumber: mockDocketNumber,
      documentId: mockDocumentId,
    });

    expect(client.delete.mock.calls[0][0]).toMatchObject({
      key: {
        pk: `case|${mockDocketNumber}`,
        sk: `document|${mockDocumentId}`,
      },
    });
  });
});
