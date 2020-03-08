const client = require('../../dynamodbClientService');
const sinon = require('sinon');
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
    sinon.stub(client, 'update').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
  });

  afterEach(() => {
    client.update.restore();
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await updateDocumentProcessingStatus({
      applicationContext,
      caseId: 'abc',
      documentId: 3,
    });
    expect(client.update.getCall(0).args[0]).toMatchObject({
      Key: { pk: 'case|abc', sk: 'document|3' },
      UpdateExpression: 'SET #processingStatus = :status',
    });
  });
});
