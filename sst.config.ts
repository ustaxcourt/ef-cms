import { Api, Function, WebSocketApi } from 'sst/constructs';
import {
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
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
  'S3_ENDPOINT',
  'USER_POOL_ID_MAIN',
  'USER_POOL_ID_IRS',
  'REGION',
  'NODE_ENV',
] as const;

const environment: Record<(typeof EXPECTED_ENV_KEYS)[number], string> = {};

for (let key of EXPECTED_ENV_KEYS) {
  if (process.env[key] === undefined) {
    console.error(
      `expected env variable of ${key} to be set but was never set`,
    );
    process.exit(1);
  }
  environment[key] = process.env[key] as string;
}
environment.NODE_OPTIONS = '--enable-source-maps';
environment.NODE_ENV = 'production';

// eslint-disable-next-line import/no-default-export
export default {
  config() {
    return {
      name: 'ef-cms-api',
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      environment,
      nodejs: {
        esbuild: {
          loader: {
            '.node': 'file',
          },
        },
        sourcemap: true,
      },
    });
    app.stack(function Site({ stack }) {
      const role = new Role(stack, 'lambda_role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      role.attachInlinePolicy(
        new Policy(stack, 'api_lambda_policy', {
          statements: [
            new PolicyStatement({
              actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams',
              ],
              effect: Effect.ALLOW,
              resources: ['arn:aws:logs:*:*:*'],
            }),
            new PolicyStatement({
              actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
              effect: Effect.ALLOW,
              resources: ['*'],
            }),
            new PolicyStatement({
              actions: ['lambda:InvokeFunction'],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:lambda:us-east-1:${app.account}:function:*`,
                `arn:aws:lambda:us-west-1:${app.account}:function:*`,
              ],
            }),
            new PolicyStatement({
              actions: [
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminDisableUser',
                'cognito-idp:AdminGetUser',
                'cognito-idp:AdminUpdateUserAttributes',
                'cognito-idp:ListUserPoolClients',
                'cognito-idp:ListUsers',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:cognito-idp:us-east-1:${app.account}:userpool/*`,
              ],
            }),
            new PolicyStatement({
              actions: [
                's3:DeleteObject',
                's3:GetObject',
                's3:ListBucket',
                's3:PutObject',
                's3:PutObjectTagging',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:s3:::${environment.EFCMS_DOMAIN}-documents-*`,
                `arn:aws:s3:::${environment.EFCMS_DOMAIN}-temp-documents-*`,
                `arn:aws:s3:::${environment.EFCMS_DOMAIN}-quarantine-*`,
              ],
            }),
            new PolicyStatement({
              actions: ['s3:ListBucket'],
              effect: Effect.ALLOW,
              resources: [`arn:aws:s3:::*.${environment.EFCMS_DOMAIN}`],
            }),
            new PolicyStatement({
              actions: [
                'dynamodb:BatchGetItem',
                'dynamodb:BatchWriteItem',
                'dynamodb:DeleteItem',
                'dynamodb:DescribeStream',
                'dynamodb:DescribeTable',
                'dynamodb:GetItem',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:ListStreams',
                'dynamodb:PutItem',
                'dynamodb:Query',
                'dynamodb:UpdateItem',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:dynamodb:us-east-1:${app.account}:table/efcms-${environment.ENV}-*`,
                `arn:aws:dynamodb:us-west-1:${app.account}:table/efcms-${environment.ENV}-*`,
              ],
            }),
            new PolicyStatement({
              actions: [
                'dynamodb:GetItem',
                'dynamodb:DescribeTable',
                'dynamodb:UpdateItem',
                'dynamodb:PutItem',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:dynamodb:us-east-1:${app.account}:table/efcms-deploy-${environment.ENV}`,
              ],
            }),
            new PolicyStatement({
              actions: ['ses:SendBulkTemplatedEmail'],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:ses:us-east-1:${app.account}:identity/noreply@${environment.EFCMS_DOMAIN}`,
              ],
            }),
            new PolicyStatement({
              actions: ['ses:GetSendStatistics'],
              effect: Effect.ALLOW,
              resources: ['*'],
            }),
            new PolicyStatement({
              actions: [
                'es:ESHttpDelete',
                'es:ESHttpGet',
                'es:ESHttpPost',
                'es:ESHttpPut',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:es:us-east-1:${app.account}:domain/efcms-search-${environment.ENV}-*`,
              ],
            }),
            new PolicyStatement({
              actions: ['execute-api:Invoke', 'execute-api:ManageConnections'],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:execute-api:us-east-1:${app.account}:*`,
                `arn:aws:execute-api:us-west-1:${app.account}:*`,
              ],
            }),
            new PolicyStatement({
              actions: ['sns:Publish'],
              effect: Effect.ALLOW,
              resources: [`arn:aws:sns:us-east-1:${app.account}:seal_notifier`],
            }),
            new PolicyStatement({
              actions: ['sns:Subscribe'],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:sns:us-east-1:${app.account}:bounced_service_emails_${environment.ENV}`,
              ],
            }),
            new PolicyStatement({
              actions: [
                'sqs:DeleteMessage',
                'sqs:SendMessage',
                'sqs:ReceiveMessage',
                'sqs:GetQueueAttributes',
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:sqs:us-east-1:${app.account}:*`,
                `arn:aws:sqs:us-west-1:${app.account}:*`,
              ],
            }),
          ],
        }),
      );

      const authRole = new Role(stack, 'lambda_auth_role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });
      authRole.grantAssumeRole(
        new ServicePrincipal('apigateway.amazonaws.com'),
      );

      const websocket = new WebSocketApi(stack, 'WebsocketApi', {
        authorizer: {
          function: new Function(stack, 'WebsocketAuthorizer', {
            handler:
              'web-api/terraform/template/lambdas/websocket-authorizer.handler',
            role: authRole,
          }),
          identitySource: ['route.request.querystring.token'],
          type: 'lambda',
        },
        defaults: {
          function: {
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

      const asyncLambdaFunction = new Function(stack, 'asyncLambda', {
        handler: 'web-api/src/lambdas/async/asyncLambda.asyncLambda',
        role,
        timeout: '900 second',
      });

      const api = new Api(stack, 'Api', {
        authorizers: {
          cognitoAuthorizer: {
            function: new Function(stack, 'CognitoAuthorizer', {
              handler:
                'web-api/terraform/template/lambdas/cognito-authorizer.handler',
            }),
            type: 'lambda',
          },
        },
        defaults: {
          function: {
            role,
          },
        },
        routes: {
          'ANY /{proxy+}': {
            authorizer: 'cognitoAuthorizer',
            function: {
              environment: {
                ...environment,
                ASYNC_LAMBDA_NAME: asyncLambdaFunction.functionName,
              },
              handler: 'web-api/terraform/template/lambdas/api.handler',
            },
          },
        },
      });

      // Show the API endpoint in the output
      stack.addOutputs({
        ApiEndpoint: api.url,
        WebsocketEndpoint: websocket.url,
        batchDownloadLambdaName: asyncLambdaFunction.functionName,
      });
    });
  },
} satisfies SSTConfig;
