const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { incrementCounter } = require('./incrementCounter');

describe('incrementCounter', () => {
  beforeEach(() => {
    client.updateConsistent = jest.fn().mockReturnValue({ id: 1 });
  });

  it('should update the docketNumber counter for the provided year', async () => {
    await incrementCounter({
      applicationContext,
      key: '3',
      year: '2029',
    });

    expect(client.updateConsistent.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: '3-2029',
        sk: '3-2029',
      },
    });
  });

  it('should update the docketNumber counter for the current year when one is not provided', async () => {
    const { year: currentYear } = applicationContext
      .getUtilities()
      .getMonthDayYearObj();

    await incrementCounter({
      applicationContext,
      key: '4',
    });

    expect(client.updateConsistent.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: `4-${currentYear}`,
        sk: `4-${currentYear}`,
      },
    });
  });
});
