const client = require('../../dynamodbClientService');
const { isCurrentColorActive } = require('./isCurrentColorActive');

describe('isCurrentColorActive', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([{ value: 'blue' }]);
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
    const val = await isCurrentColorActive();

    expect(val).toEqual(true);
  });

  it('looks in the deploy table to figure out what the currently deployed color is', async () => {
    await isCurrentColorActive();

    expect(client.getDeployTableName).toBeCalled();
  });
});
