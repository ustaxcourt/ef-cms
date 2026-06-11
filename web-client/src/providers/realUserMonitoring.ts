import { AwsRum, AwsRumConfig } from 'aws-rum-web';

let awsRum: AwsRum | undefined;

export const initializeRealUserMonitoring = (): void => {
  if (process.env.ENV === 'local') return;
  try {
    const identityPoolId = process.env.RUM_IDENTITY_POOL_ID;
    const sampleRateStr = process.env.RUM_SAMPLE_RATE;
    const appMonitorId = process.env.RUM_APP_MONITOR_ID;

    if (!identityPoolId || !sampleRateStr || !appMonitorId) {
      throw new Error(
        'Missing required RUM environment variables: RUM_IDENTITY_POOL_ID, RUM_SAMPLE_RATE, RUM_APP_MONITOR_ID',
      );
    }

    const config: AwsRumConfig = {
      allowCookies: true,
      enableXRay: false,
      endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
      identityPoolId,
      sessionSampleRate: Number(sampleRateStr),
      telemetries: [
        'performance',
        'errors',
        // Record failed HTTP requests (4xx/5xx and network errors). axios runs
        // on XMLHttpRequest in the browser, which this telemetry instruments.
        // recordAllRequests stays false so we only capture errors, not every
        // successful request.
        ['http', { recordAllRequests: false }],
      ],
    };

    const APPLICATION_ID: string = appMonitorId;
    const APPLICATION_VERSION: string = '0.0.1';

    awsRum = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      'us-east-1',
      config,
    );

    awsRum.enable();
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
    console.log('Error initializing real user monitoring: ', error);
  }
};

/**
 * Records an error to CloudWatch RUM. Safe to call when RUM has not been
 * initialized (e.g. local env or failed initialization) - it is a no-op.
 */
export const recordError = (error: unknown): void => {
  if (!awsRum) return;
  try {
    awsRum.recordError(error);
  } catch (rumError) {
    console.log('Error recording error to real user monitoring: ', rumError);
  }
};
