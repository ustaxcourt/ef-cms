const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { isCurrentColorActive } = require('./isCurrentColorActive');

describe('isCurrentColorActive', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    client.getFromDeployTable = jest.fn().mockReturnValue({
      current: 'blue',
      pk: 'current-color',
      sk: 'current-color',
    });
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('checks where the current color in the deploy table matches the current color of the environment', async () => {
    process.env.CURRENT_COLOR = 'blue';
    const val = await isCurrentColorActive(applicationContext);

    expect(client.getFromDeployTable.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'current-color',
        sk: 'current-color',
      },
    });
    expect(val).toEqual(true);
  });
});
