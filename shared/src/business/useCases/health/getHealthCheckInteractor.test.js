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
        'app.dev.ustc-case-mgmt.flexion.us': true,
        'app-failover.dev.ustc-case-mgmt.flexion.us': true,
        'dev.ustc-case-mgmt.flexion.us': true,
        'dev.ustc-case-mgmt.flexion.us-documents-dev-us-east-1': true,
        'dev.ustc-case-mgmt.flexion.us-documents-dev-us-west-1': true,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-dev-us-east-1': true,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-dev-us-west-1': true,
        'failover.dev.ustc-case-mgmt.flexion.us': true,
      },
    });
  });

  it('should return false for all services if services are down', async () => {
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
        'app.dev.ustc-case-mgmt.flexion.us': false,
        'app-failover.dev.ustc-case-mgmt.flexion.us': false,
        'dev.ustc-case-mgmt.flexion.us': false,
        'dev.ustc-case-mgmt.flexion.us-documents-dev-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-documents-dev-us-west-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-dev-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-dev-us-west-1': false,
        'failover.dev.ustc-case-mgmt.flexion.us': false,
      },
    });
  });
});
