const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getWorkItemsByDocketNumber } = require('./getWorkItemsByDocketNumber');

describe('getWorkItemsByDocketNumber', () => {
  beforeEach(() => {
    client.query = jest.fn();
  });

  it('should call client.query with pk of case|{docketNumber}', async () => {
    const mockDocketNumber = '101-21';

    await getWorkItemsByDocketNumber({
      applicationContext,
      docketNumber: mockDocketNumber,
    });

    expect(client.query.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':pk': `case|${mockDocketNumber}`,
        ':prefix': 'work-item',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    });
  });
});
