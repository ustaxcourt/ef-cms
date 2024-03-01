import { Api } from 'sst/constructs';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
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
  'DYNAMODB_ENDPOINT', // TODO: CI Defined
  'DYNAMODB_TABLE_NAME', // TODO: CI Defined
  'ELASTICSEARCH_ENDPOINT', // TODO: CI Defined
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
  config(_input) {
    return {
      name: 'ef-cms-api',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const role = Role.fromRoleName(stack, 'lambda_role', 'lambda_role_exp5');

      const api = new Api(stack, 'Api', {
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
          'GET /cases/{docketNumber}':
            'web-api/src/lambdas/cases/getCaseLambda.getCaseLambda',
        },
      });

      // Show the API endpoint in the output
      stack.addOutputs({
        ApiEndpoint: api.url,
      });
    });
  },
} satisfies SSTConfig;
