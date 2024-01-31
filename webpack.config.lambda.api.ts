/* eslint-disable import/no-default-export */
import getConfig from './webpack.config.lambda';
import webpack from 'webpack';

const entries = {
  'api/api': './web-api/terraform/template/lambdas/api.ts',
  'api-public/api-public': './web-api/terraform/template/lambdas/api-public.ts',
  'cognito-authorizer/cognito-authorizer':
    './web-api/terraform/template/lambdas/cognito-authorizer.ts',
  'cognito-triggers/cognito-triggers':
    './web-api/terraform/template/lambdas/cognito-triggers.ts',
  'cron/cron': './web-api/terraform/template/lambdas/cron.ts',
  'handle-bounced-service-email/handle-bounced-service-email':
    './web-api/terraform/template/lambdas/handle-bounced-service-email.ts',
  'maintenance-notify/maintenance-notify':
    './web-api/terraform/template/lambdas/maintenance-notify.ts',
  'pdf-generation/pdf-generation':
    './web-api/terraform/template/lambdas/pdf-generation.ts',
  'public-api-authorizer/public-api-authorizer':
    './web-api/terraform/template/lambdas/public-api-authorizer.ts',
  'seal-in-lower-environment/seal-in-lower-environment':
    './web-api/terraform/template/lambdas/seal-in-lower-environment.ts',
  'send-emails/send-emails':
    './web-api/terraform/template/lambdas/send-emails.ts',
  'streams/streams': './web-api/terraform/template/lambdas/streams.ts',
  'trial-session/trial-session':
    './web-api/terraform/template/lambdas/trial-session.ts',
  'websocket-authorizer/websocket-authorizer':
    './web-api/terraform/template/lambdas/websocket-authorizer.ts',
  'websockets/websockets': './web-api/terraform/template/lambdas/websockets.ts',
};

const apiConfig: webpack.Configuration = {
  ...getConfig(Object.keys(entries).map(key => `./${key.split('/')[0]}`)),
  entry: entries,
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/template/lambdas/dist',
  },
};

export default apiConfig;
