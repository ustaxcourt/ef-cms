const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateWorkItemAssociatedJudge,
} = require('./updateWorkItemAssociatedJudge');

describe('updateWorkItemAssociatedJudge', () => {
  beforeEach(() => {
    client.update = jest.fn();
  });

  it('should call client.update with passed in associated judge and work item pk and sk', async () => {
    const mockAssociatedJudge = 'Judge Cat';
    const mockPk = 'work-item|pk';
    const mockSk = 'work-item|sk';

    await updateWorkItemAssociatedJudge({
      applicationContext,
      associatedJudge: mockAssociatedJudge,
      workItem: {
        pk: mockPk,
        sk: mockSk,
      },
    });

    expect(client.update.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': mockAssociatedJudge,
      },
      Key: {
        pk: mockPk,
        sk: mockSk,
      },
    });
  });
});
