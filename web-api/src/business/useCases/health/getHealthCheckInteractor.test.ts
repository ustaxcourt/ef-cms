import { S3 } from '@aws-sdk/client-s3';
import { getHealthCheckInteractor } from './getHealthCheckInteractor';

const mockListObjectsV2 = jest
  .spyOn(S3.prototype, 'listObjectsV2')
  .mockResolvedValue({} as never);

describe('getHealthCheckInteractor', () => {
  it('should return the expected true statuses for all services', async () => {
    const statusResult = await getHealthCheckInteractor({
      environment: {
        stage: 'dev',
      },
      getCognito() {
        return { describeUserPool: jest.fn() };
      },
      getHttpClient: () => {
        return {
          CancelToken: {
            source: () => ({
              cancel: () => null,
            }),
          },
          get: () => Promise.resolve(true),
        };
      },
      getPersistenceGateway() {
        return {
          getClientId: () => 'a',
          getDeployTableStatus: () => 'ACTIVE',
          getFirstSingleCaseRecord: () => true,
          getSesStatus: () => true,
          getTableStatus: () => 'ACTIVE',
        };
      },
      getScannerResourceUri: () => '',
      logger: {
        error: () => {},
      },
    } as any);

    expect(statusResult).toEqual({
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
        eastTempDocuments: true,
        public: true,
        publicFailover: true,
        westDocuments: true,
        westTempDocuments: true,
      },
    });
  });

  it('should return false for all services when services are down', async () => {
    mockListObjectsV2.mockRejectedValue(new Error('S3 is down') as never);
    const status = await getHealthCheckInteractor({
      environment: {
        stage: 'dev',
      },
      getHttpClient: () => {
        return {
          CancelToken: {
            source: () => ({
              cancel: () => null,
            }),
          },
          get: () => Promise.reject(true),
        };
      },
      getPersistenceGateway() {
        return {
          getClientId: () => {
            throw new Error();
          },
          getDeployTableStatus: () => {
            throw new Error();
          },
          getFirstSingleCaseRecord: () => {
            throw new Error();
          },
          getSesStatus: () => {
            throw new Error();
          },
          getTableStatus: () => {
            throw new Error();
          },
        };
      },
      getScannerResourceUri: () => '',
      logger: {
        error: () => {},
      },
    } as any);

    expect(status).toEqual({
      cognito: false,
      dynamo: {
        efcms: false,
        efcmsDeploy: false,
      },
      dynamsoft: false,
      elasticsearch: false,
      emailService: false,
      s3: {
        app: false,
        appFailover: false,
        eastDocuments: false,
        eastTempDocuments: false,
        public: false,
        publicFailover: false,
        westDocuments: false,
        westTempDocuments: false,
      },
    });
  });

  describe('s3', () => {
    const oldEnv = process.env;

    afterAll(() => {
      process.env = oldEnv;
    });

    it('should get the status of the buckets when the current color is green', async () => {
      process.env.CURRENT_COLOR = 'pink';
      process.env.EFCMS_DOMAIN = 'example';
      mockListObjectsV2.mockResolvedValue(true as never);

      await getHealthCheckInteractor({
        environment: {
          stage: 'dev',
        },
        getHttpClient: () => {
          return {
            CancelToken: {
              source: () => ({
                cancel: () => null,
              }),
            },
            get: () => Promise.resolve(true),
          };
        },
        getPersistenceGateway() {
          return {
            getClientId: () => 'a',
            getDeployTableStatus: () => 'ACTIVE',
            getFirstSingleCaseRecord: () => true,
            getSesStatus: () => true,
            getTableStatus: () => 'ACTIVE',
          };
        },
        logger: {
          error: () => {},
        },
      } as any);

      // app bucket
      expect(mockListObjectsV2.mock.calls[0][0].Bucket).toBe(
        `app-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // app fail-over bucket
      expect(mockListObjectsV2.mock.calls[1][0].Bucket).toBe(
        `app-failover-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // public bucket
      expect(mockListObjectsV2.mock.calls[4][0].Bucket).toBe(
        `${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // public fail-over bucket
      expect(mockListObjectsV2.mock.calls[5][0].Bucket).toBe(
        `failover-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
    });
  });
});
