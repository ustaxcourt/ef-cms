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
});
