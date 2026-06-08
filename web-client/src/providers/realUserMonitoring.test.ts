const mockRecordError = jest.fn();
const mockEnable = jest.fn();
const mockAwsRum = jest.fn().mockImplementation(() => ({
  enable: mockEnable,
  recordError: mockRecordError,
}));

jest.mock('aws-rum-web', () => ({
  AwsRum: mockAwsRum,
}));

describe('realUserMonitoring', () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  it('recordError is a no-op when RUM has not been initialized', () => {
    process.env.ENV = 'local';
    const { recordError } = require('./realUserMonitoring');

    expect(() => recordError(new Error('boom'))).not.toThrow();
    expect(mockRecordError).not.toHaveBeenCalled();
  });

  it('forwards the error to AwsRum once initialized', () => {
    process.env.ENV = 'dev';
    const {
      initializeRealUserMonitoring,
      recordError,
    } = require('./realUserMonitoring');

    initializeRealUserMonitoring();
    const error = new Error('boom');
    recordError(error);

    expect(mockRecordError).toHaveBeenCalledWith(error);
  });

  it('configures the http telemetry so failed HTTP requests are recorded', () => {
    process.env.ENV = 'dev';
    const { initializeRealUserMonitoring } = require('./realUserMonitoring');

    initializeRealUserMonitoring();

    const config = mockAwsRum.mock.calls[0][3];
    expect(config.telemetries).toContainEqual([
      'http',
      { recordAllRequests: false },
    ]);
  });
});
