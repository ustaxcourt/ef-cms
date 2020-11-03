const { getHealthCheckInteractor } = require('./getHealthCheckInteractor');

describe('getHealthCheckInteractor', () => {
  it('should return the expected true statues for all services', async () => {
    const status = await getHealthCheckInteractor({
      applicationContext: {
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
        getStorageClient: () => {
          return {
            listObjectsV2: () => ({
              promise: () => Promise.resolve(true),
            }),
          };
        },
        logger: {
          error: () => {},
        },
      },
    });

    expect(status).toEqual({
      clamAV: false,
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
    const status = await getHealthCheckInteractor({
      applicationContext: {
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
        getStorageClient: () => {
          return {
            listObjectsV2: () => ({
              promise: () => Promise.reject(true),
            }),
          };
        },
        logger: {
          error: () => {},
        },
      },
    });
    expect(status).toEqual({
      clamAV: false,
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
      const listObjectsMock = jest.fn().mockReturnValue(Promise.resolve(true));

      await getHealthCheckInteractor({
        applicationContext: {
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
          getStorageClient: () => {
            return {
              listObjectsV2: listObjectsMock,
            };
          },

          logger: {
            error: () => {},
          },
        },
      });

      // app bucket
      expect(listObjectsMock.mock.calls[0][0].Bucket).toBe(
        `app-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // app fail-over bucket
      expect(listObjectsMock.mock.calls[1][0].Bucket).toBe(
        `app-failover-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // public bucket
      expect(listObjectsMock.mock.calls[4][0].Bucket).toBe(
        `${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
      // public fail-over bucket
      expect(listObjectsMock.mock.calls[5][0].Bucket).toBe(
        `failover-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}`,
      );
    });
  });
});
