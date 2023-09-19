import { StoredApplicationHealth } from '@web-api/persistence/dynamo/deployTable/setStoredApplicationHealth';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCachedHealthCheckInteractor } from './getCachedHealthCheckInteractor';

describe('getCachedHealthCheckInteractor', () => {
  const OLD_ENV_REGION = process.env.REGION;

  beforeAll(() => {
    const mockStoredApplicationHealth: StoredApplicationHealth = {
      allChecksHealthy: true,
      timeStamp: 12312123112,
    };

    applicationContext
      .getPersistenceGateway()
      .getStoredApplicationHealth.mockResolvedValue(
        mockStoredApplicationHealth,
      );
  });

  afterAll(() => {
    process.env.REGION = OLD_ENV_REGION;
  });

  it('should get stored application health from the region in which this process is running', async () => {
    const region = 'us-west-2';
    process.env.REGION = region;

    await getCachedHealthCheckInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getStoredApplicationHealth,
    ).toHaveBeenCalledWith(expect.anything(), region);
  });
});
