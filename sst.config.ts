import { Api, Function, WebSocketApi } from 'sst/constructs';
import { Role } from 'aws-cdk-lib/aws-iam';
import { SSTConfig } from 'sst';

const EXPECTED_ENV_KEYS = [
  'BOUNCED_EMAIL_RECIPIENT',
  'CIRCLE_AWS_ACCESS_KEY_ID',
  'CIRCLE_AWS_ACCOUNT_ID',
  'CIRCLE_AWS_SECRET_ACCESS_KEY',
  'COGNITO_SUFFIX',
  'CW_VIEWER_PROTOCOL_POLICY',
  'DEFAULT_ACCOUNT_PASS',
  'DISABLE_EMAILS',
  'DYNAMSOFT_PRODUCT_KEYS',
  'DYNAMSOFT_S3_ZIP_PATH',
  'DYNAMSOFT_URL',
  'DYNAMSOFT_URL_OVERRIDE',
  'EFCMS_DOMAIN',
  'EMAIL_DMARC_POLICY',
  'ENABLE_HEALTH_CHECKS',
  'ENV',
  'ES_INSTANCE_COUNT',
  'ES_INSTANCE_TYPE',
  'ES_VOLUME_SIZE',
  'IRS_SUPERUSER_EMAIL',
  'QUARANTINE_BUCKET_NAME',
  'STAGE',
  'TEMP_DOCUMENTS_BUCKET_NAME',
  'IS_DYNAMSOFT_ENABLED',
  'USTC_ADMIN_PASS',
  'USTC_ADMIN_USER',
  'ZONE_NAME',
  'DOCUMENTS_BUCKET_NAME',
  'CURRENT_COLOR', // TODO: CI Defined
  'DEPLOYMENT_TIMESTAMP', // TODO: CI Defined
  'DYNAMODB_TABLE_NAME', // TODO: CI Defined
  'ELASTICSEARCH_ENDPOINT', // TODO: CI Defined
  'USER_POOL_ID_MAIN',
  'USER_POOL_ID_IRS',
  'REGION',
];

const environment: Record<string, string> = {};

for (let key of EXPECTED_ENV_KEYS) {
  if (process.env[key] === undefined) {
    console.error(
      `expected env variable of ${key} to be set but was never set`,
    );
    process.exit(1);
  }
  environment[key] = process.env[key] as string;
}

// eslint-disable-next-line import/no-default-export
export default {
  config() {
    return {
      name: 'ef-cms-api',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const role = Role.fromRoleName(stack, 'lambda_role', 'lambda_role_exp5');
      const authRole = Role.fromRoleName(
        stack,
        'websocket_auth_role',
        'authorizer_lambda_role_exp5',
      );

      const websocket = new WebSocketApi(stack, 'WebsocketApi', {
        authorizer: {
          function: new Function(stack, 'WebsocketAuthorizer', {
            environment,
            handler:
              'web-api/terraform/template/lambdas/websocket-authorizer.handler',
            role: authRole,
          }),
          identitySource: ['route.request.querystring.token'],
          type: 'lambda',
        },
        defaults: {
          function: {
            environment,
            nodejs: {
              esbuild: {
                loader: {
                  '.node': 'file',
                },
              },
            },
            role,
          },
        },
        routes: {
          $connect:
            'web-api/terraform/template/lambdas/websockets.connectHandler',
          $default:
            'web-api/terraform/template/lambdas/websockets.defaultHandler',
          $disconnect:
            'web-api/terraform/template/lambdas/websockets.disconnectHandler',
        },
      });

      const batchDownloadFunction = new Function(
        stack,
        'batchDownloadFunction',
        {
          nodejs: {
            esbuild: {
              loader: {
                '.node': 'file',
              },
            },
          },
          role,
        },
      );
      console.log('Batch download name', batchDownloadFunction.functionName);

      const api = new Api(stack, 'Api', {
        authorizers: {
          cognitoAuthorizer: {
            function: new Function(stack, 'CognitoAuthorizer', {
              environment,
              handler:
                'web-api/terraform/template/lambdas/cognito-authorizer.handler',
            }),
            type: 'lambda',
          },
        },
        defaults: {
          function: {
            nodejs: {
              esbuild: {
                loader: {
                  '.node': 'file',
                },
              },
            },
            role,
          },
        },
        routes: {
          'ANY /{proxy+}': {
            authorizer: 'cognitoAuthorizer',
            function: {
              handler: 'web-api/terraform/template/lambdas/api.handler',
            },
          },
        },
      });

      // Show the API endpoint in the output
      stack.addOutputs({
        ApiEndpoint: api.url,
        WebsocketEndpoint: websocket.url,
      });
    });
  },
} satisfies SSTConfig;
