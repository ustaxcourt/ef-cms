const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getWorkItemsByWorkItemId } = require('./getWorkItemsByWorkItemId');

describe('getWorkItemsByWorkItemId', () => {
  beforeEach(() => {
    client.query = jest.fn();
  });

  it('should call client.query with gsi1pk of work-item|{workItemId}', async () => {
    const mockWorkItemId = '7ca81520-95c3-4446-a8dc-eca9ea7364c5';

    await getWorkItemsByWorkItemId({
      applicationContext,
      workItemId: mockWorkItemId,
    });

    expect(client.query.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':gsi1pk': `work-item|${mockWorkItemId}`,
      },
    });
  });
});
