import { AwsRum, AwsRumConfig } from 'aws-rum-web';

export const initializeRealUserMonitoring = () => {
  if (process.env.ENV === 'local') return;
  let awsRum: AwsRum;
  try {
    const config: AwsRumConfig = {
      allowCookies: true,
      enableXRay: false,
      endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
      identityPoolId: process.env.RUM_IDENTITY_POOL_ID,
      sessionSampleRate: process.env.ENV === 'prod' ? 0.1 : 1, // sample 10% of sessions in production until we know how expensive this will be, 100% in lower environments
      telemetries: ['performance'],
    };

    const APPLICATION_ID: string = process.env.RUM_APP_MONITOR_ID!;
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
  }
};
