import { applicationContext } from '../../test/createTestApplicationContext';
import { setHealthCheckCacheInteractor } from './setHealthCheckCacheInteractor';

describe('setHealthCheckCacheInteractor', () => {
  const oldRegion = process.env.REGION;

  beforeEach(() => {});

  afterAll(() => {
    process.env.REGION = oldRegion;
  });

  it('should set the application health to healthy', async () => {
    const region = 'us-west-2';
    process.env.REGION = region;

    await setHealthCheckCacheInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().setStoredApplicationHealth,
    ).toHaveBeenCalledWith(expect.anything(), {
      allChecksHealthy: true,
      region,
    });
  });
});
