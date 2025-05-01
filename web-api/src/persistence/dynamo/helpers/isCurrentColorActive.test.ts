import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getSsmParameter } from '@web-api/persistence/ssm/ssmClientService';
import { isCurrentColorActive } from './isCurrentColorActive';

jest.mock('@web-api/persistence/ssm/ssmClientService', () => ({
  getSsmParameter: jest.fn().mockReturnValue('blue'),
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
    const RESULTS = await isCurrentColorActive(applicationContext);

    const getSsmParameterCalls = (getSsmParameter as jest.Mock).mock.calls;
    expect(getSsmParameterCalls.length).toEqual(1);
    expect(getSsmParameterCalls[0][0]).toMatchObject({
      parameterName: 'current-color',
    });
    expect(RESULTS).toEqual(true);
  });
});
