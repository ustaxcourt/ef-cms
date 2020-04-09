const client = require('../../dynamodbClientService');
const { getSortRecords } = require('./getSortRecords');

describe('getSortRecords', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    client.query = jest.fn().mockReturnValue(null);
  });

  it('invokes the persistence layer with the expected pk and sk', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await getSortRecords({
      afterDate: 'now',
      applicationContext,
      key: 'a',
      type: 'b',
    });
    expect(client.query.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: {
        ':afterDate': 'now',
        ':pk': 'a|b',
      },
      KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    });
  });
});
