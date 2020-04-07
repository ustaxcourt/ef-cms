const client = require('../../dynamodbClientService');
const {
  updateDocumentProcessingStatus,
} = require('./updateDocumentProcessingStatus');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('updateDocumentProcessingStatus', () => {
  beforeEach(() => {
    client.update = jest.fn().mockReturnValue({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
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
