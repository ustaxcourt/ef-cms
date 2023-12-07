const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    api: './web-api/terraform/template/lambdas/api.ts',
    'api-public': './web-api/terraform/template/lambdas/api-public.ts',
    'cognito-authorizer':
      './web-api/terraform/template/lambdas/cognito-authorizer.ts',
    'cognito-triggers':
      './web-api/terraform/template/lambdas/cognito-triggers.ts',
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
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/template/lambdas/dist',
  },
};
