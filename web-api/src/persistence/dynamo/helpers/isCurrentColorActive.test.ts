import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getFromDeployTable } from '../../dynamodbClientService';
import { isCurrentColorActive } from './isCurrentColorActive';

jest.mock('../../dynamodbClientService', () => ({
  getFromDeployTable: jest.fn().mockReturnValue({
    current: 'blue',
    pk: 'current-color',
    sk: 'current-color',
  }),
}));

describe('isCurrentColorActive', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('checks where the current color in the deploy table matches the current color of the environment', async () => {
    process.env.CURRENT_COLOR = 'blue';
    const val = await isCurrentColorActive(applicationContext);

    expect((getFromDeployTable as jest.Mock).mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'current-color',
        sk: 'current-color',
      },
    });
    expect(val).toEqual(true);
  });
});
