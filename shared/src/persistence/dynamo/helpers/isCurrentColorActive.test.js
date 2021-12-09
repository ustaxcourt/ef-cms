const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { isCurrentColorActive } = require('./isCurrentColorActive');

describe('isCurrentColorActive', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      current: 'blue',
      pk: 'current-color',
      sk: 'current-color',
    });
    client.getDeployTableName = jest
      .fn()
      .mockReturnValue([{ value: 'efcms-local-deploy' }]);
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('checks where the current color in the deploy table matches the current color of the environment', async () => {
    process.env.CURRENT_COLOR = 'blue';
    const val = await isCurrentColorActive(applicationContext);

    expect(val).toEqual(true);
  });

  it('looks in the deploy table to figure out what the currently deployed color is', async () => {
    await isCurrentColorActive(applicationContext);

    expect(client.getDeployTableName).toBeCalled();
  });
});
