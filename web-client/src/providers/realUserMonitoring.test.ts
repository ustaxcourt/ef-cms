const mockAddSessionAttributes = jest.fn();
const mockRecordError = jest.fn();
const mockRecordPageView = jest.fn();
const mockEnable = jest.fn();
const mockAwsRum = jest.fn().mockImplementation(() => ({
  addSessionAttributes: mockAddSessionAttributes,
  enable: mockEnable,
  recordError: mockRecordError,
  recordPageView: mockRecordPageView,
}));

jest.mock('aws-rum-web', () => ({
  AwsRum: mockAwsRum,
}));

describe('realUserMonitoring', () => {
  const originalEnv = {
    ENV: process.env.ENV,
    RUM_APP_MONITOR_ID: process.env.RUM_APP_MONITOR_ID,
    RUM_IDENTITY_POOL_ID: process.env.RUM_IDENTITY_POOL_ID,
    RUM_RELEASE_ID: process.env.RUM_RELEASE_ID,
    RUM_SAMPLE_RATE: process.env.RUM_SAMPLE_RATE,
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.RUM_APP_MONITOR_ID = 'test-app-monitor-id';
    process.env.RUM_IDENTITY_POOL_ID = 'us-east-1:test-identity-pool-id';
    process.env.RUM_SAMPLE_RATE = '1';
    delete process.env.RUM_RELEASE_ID;
  });

  afterAll(() => {
    process.env.ENV = originalEnv.ENV;
    process.env.RUM_APP_MONITOR_ID = originalEnv.RUM_APP_MONITOR_ID;
    process.env.RUM_IDENTITY_POOL_ID = originalEnv.RUM_IDENTITY_POOL_ID;
    process.env.RUM_RELEASE_ID = originalEnv.RUM_RELEASE_ID;
    process.env.RUM_SAMPLE_RATE = originalEnv.RUM_SAMPLE_RATE;
  });

  it('recordError is a no-op when RUM has not been initialized', () => {
    process.env.ENV = 'local';
    const { recordError } = require('./realUserMonitoring');

    expect(() => recordError(new Error('boom'))).not.toThrow();
    expect(mockRecordError).not.toHaveBeenCalled();
  });

  it('setRumUserContext is a no-op when RUM has not been initialized', () => {
    process.env.ENV = 'local';
    const { setRumUserContext } = require('./realUserMonitoring');

    expect(() =>
      setRumUserContext({
        role: 'petitioner',
        section: 'petitioner',
        userId: 'user-id',
      }),
    ).not.toThrow();
    expect(mockAddSessionAttributes).not.toHaveBeenCalled();
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

  it('configures AwsRum with X-Ray disabled', () => {
    process.env.ENV = 'dev';
    const { initializeRealUserMonitoring } = require('./realUserMonitoring');

    initializeRealUserMonitoring();

    const config = mockAwsRum.mock.calls[0][3];
    expect(config.enableXRay).toBe(false);
  });

  it('disables automatic page views so errors group by normalized route', () => {
    process.env.ENV = 'dev';
    const { initializeRealUserMonitoring } = require('./realUserMonitoring');

    initializeRealUserMonitoring();

    const config = mockAwsRum.mock.calls[0][3];
    expect(config.disableAutoPageView).toBe(true);
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

  it('passes the releaseId to AwsRum so RUM can locate matching source maps', () => {
    process.env.ENV = 'dev';
    process.env.RUM_RELEASE_ID = 'abc123sha';
    const { initializeRealUserMonitoring } = require('./realUserMonitoring');

    initializeRealUserMonitoring();

    const config = mockAwsRum.mock.calls[0][3];
    expect(config.releaseId).toBe('abc123sha');
  });

  it('omits releaseId when RUM_RELEASE_ID is not set', () => {
    process.env.ENV = 'dev';
    const { initializeRealUserMonitoring } = require('./realUserMonitoring');

    initializeRealUserMonitoring();

    const config = mockAwsRum.mock.calls[0][3];
    expect(config.releaseId).toBeUndefined();
  });

  it('forwards session attributes to AwsRum once initialized', () => {
    process.env.ENV = 'dev';
    const {
      initializeRealUserMonitoring,
      setRumUserContext,
    } = require('./realUserMonitoring');

    initializeRealUserMonitoring();
    setRumUserContext({
      role: 'docketClerk',
      section: 'docket',
      userId: 'user-id',
    });

    expect(mockAddSessionAttributes).toHaveBeenCalledWith({
      role: 'docketClerk',
      section: 'docket',
      userId: 'user-id',
    });
  });

  it('omits section when session attributes do not include one', () => {
    process.env.ENV = 'dev';
    const {
      initializeRealUserMonitoring,
      setRumUserContext,
    } = require('./realUserMonitoring');

    initializeRealUserMonitoring();
    setRumUserContext({
      role: 'judge',
      userId: 'user-id',
    });

    expect(mockAddSessionAttributes).toHaveBeenCalledWith({
      role: 'judge',
      userId: 'user-id',
    });
  });

  it('recordRumPageView is a no-op when RUM has not been initialized', () => {
    process.env.ENV = 'local';
    const { recordRumPageView } = require('./realUserMonitoring');

    expect(() => recordRumPageView('/case-detail/{id}')).not.toThrow();
    expect(mockRecordPageView).not.toHaveBeenCalled();
  });

  it('forwards the page view to AwsRum once initialized', () => {
    process.env.ENV = 'dev';
    const {
      initializeRealUserMonitoring,
      recordRumPageView,
    } = require('./realUserMonitoring');

    initializeRealUserMonitoring();
    recordRumPageView('/case-detail/{id}');

    expect(mockRecordPageView).toHaveBeenCalledWith('/case-detail/{id}');
  });

  describe('getRumPageIdFromRoutePattern', () => {
    const { getRumPageIdFromRoutePattern } = require('./realUserMonitoring');

    it('collapses wildcard segments so dynamic ids group together', () => {
      expect(getRumPageIdFromRoutePattern('/case-detail/*')).toBe(
        '/case-detail/{id}',
      );
      expect(
        getRumPageIdFromRoutePattern(
          '/case-detail/*/edit-deficiency-statistic/*',
        ),
      ).toBe('/case-detail/{id}/edit-deficiency-statistic/{id}');
    });

    it('drops the query portion of the pattern', () => {
      expect(getRumPageIdFromRoutePattern('/case-detail/*?openModal=*')).toBe(
        '/case-detail/{id}',
      );
      expect(
        getRumPageIdFromRoutePattern('/case-detail/*/case-information?..'),
      ).toBe('/case-detail/{id}/case-information');
    });

    it('strips the optional trailing-segment marker', () => {
      expect(getRumPageIdFromRoutePattern('/verify-email..')).toBe(
        '/verify-email',
      );
    });

    it('keeps the root path as "/"', () => {
      expect(getRumPageIdFromRoutePattern('/')).toBe('/');
    });

    it('maps the catch-all pattern to a dedicated not-found group', () => {
      expect(getRumPageIdFromRoutePattern('..')).toBe('/not-found');
    });
  });
});
