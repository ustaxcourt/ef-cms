import { ApplicationHealth } from './getHealthCheckInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { setHealthCheckCacheInteractor } from './setHealthCheckCacheInteractor';

describe('setHealthCheckCacheInteractor', () => {
  const oldRegion = process.env.REGION;
  let applicationHealth: ApplicationHealth;

  beforeEach(() => {
    applicationHealth = {
      cognito: true,
      dynamo: {
        efcms: true,
        efcmsDeploy: true,
      },
      dynamsoft: true,
      elasticsearch: true,
      emailService: true,
      s3: {
        app: true,
        appFailover: true,
        eastDocuments: true,
        eastQuarantine: true,
        eastTempDocuments: true,
        public: true,
        publicFailover: true,
        westDocuments: true,
        westQuarantine: true,
        westTempDocuments: true,
      },
    };
    applicationContext
      .getUseCases()
      .getHealthCheckInteractor.mockResolvedValue(applicationHealth);
  });

  afterAll(() => {
    process.env.REGION = oldRegion;
  });

  it('should get service statuses and write an healthy status to persistence when all services are health', async () => {
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

  it('should get service statuses and write an unhealthy status to persistence when any service is unhealthy', async () => {
    const region = 'us-east-1';
    process.env.REGION = region;
    applicationHealth.dynamsoft = false;

    await setHealthCheckCacheInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().setStoredApplicationHealth,
    ).toHaveBeenCalledWith(expect.anything(), {
      allChecksHealthy: false,
      region,
    });
  });
});
