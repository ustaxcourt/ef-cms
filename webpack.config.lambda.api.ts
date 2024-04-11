/* eslint-disable import/no-default-export */
import config from './webpack.config.lambda';
import webpack from 'webpack';

const apiConfig: webpack.Configuration = {
  ...(config as any),
  entry: {
    api: './web-api/terraform/template/lambdas/api.ts',
    'api-public': './web-api/terraform/template/lambdas/api-public.ts',
    'cognito-authorizer':
      './web-api/terraform/template/lambdas/cognito-authorizer.ts',
    cron: './web-api/terraform/template/lambdas/cron.ts',
    'handle-bounced-service-email':
      './web-api/terraform/template/lambdas/handle-bounced-service-email.ts',
    'maintenance-notify':
      './web-api/terraform/template/lambdas/maintenance-notify.ts',
    'pdf-generation': './web-api/terraform/template/lambdas/pdf-generation.ts',
    'public-api-authorizer':
      './web-api/terraform/template/lambdas/public-api-authorizer.ts',
    'seal-in-lower-environment':
      './web-api/terraform/template/lambdas/seal-in-lower-environment.ts',
    'send-emails': './web-api/terraform/template/lambdas/send-emails.ts',
    streams: './web-api/terraform/template/lambdas/streams.ts',
    'trial-session': './web-api/terraform/template/lambdas/trial-session.ts',
    'websocket-authorizer':
      './web-api/terraform/template/lambdas/websocket-authorizer.ts',
    websockets: './web-api/terraform/template/lambdas/websockets.ts',
    'worker-handler': './web-api/terraform/template/lambdas/worker-handler.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/template/lambdas/dist',
  },
};

export default apiConfig;
