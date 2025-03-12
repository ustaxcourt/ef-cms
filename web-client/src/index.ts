import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { app } from './app';
import { applicationContext } from './applicationContext';

let awsRum: AwsRum;
try {
  const config: AwsRumConfig = {
    allowCookies: true,
    enableXRay: false,
    endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
    identityPoolId: process.env.RUM_IDENTITY_POOL_ID,
    sessionSampleRate: 1,
    telemetries: ['performance'],
  };

  const APPLICATION_ID: string = process.env.RUM_APP_MONITOR_ID!;
  const APPLICATION_VERSION: string = '0.0.1';

  awsRum = new AwsRum(APPLICATION_ID, APPLICATION_VERSION, 'us-east-1', config);

  awsRum.enable();
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

/**
 * Initializes the app with prod environment context
 */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.initialize(applicationContext);
