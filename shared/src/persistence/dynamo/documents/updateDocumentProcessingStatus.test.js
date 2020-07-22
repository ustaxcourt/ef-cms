const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const {
  updateDocumentProcessingStatus,
} = require('./updateDocumentProcessingStatus');

describe('updateDocumentProcessingStatus', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    client.update = jest.fn().mockReturnValue({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await updateDocumentProcessingStatus({
      applicationContext,
      caseId: 'abc',
      documentId: 3,
    });
    expect(client.update.mock.calls[0][0]).toMatchObject({
      Key: { pk: 'case|abc', sk: 'document|3' },
      UpdateExpression: 'SET #processingStatus = :status',
    });
  });
});
