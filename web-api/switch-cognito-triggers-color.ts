import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { omit } from 'lodash';

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { AWS_ACCOUNT_ID, DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;

check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(ENV, 'You must have ENV set in your environment');
check(AWS_ACCOUNT_ID, 'You must have AWS_ACCOUNT_ID set in your environment');

const cognito = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const getUserPoolId = async () => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  if (!results) throw new Error('could not get user pool id');
  if (!results.UserPools) throw new Error('could not get user pool id');
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  )?.Id;
  return userPoolId;
};

const run = async () => {
  const userPoolId = await getUserPoolId();
  const poolSettings = await cognito.describeUserPool({
    UserPoolId: userPoolId,
  });

  if (!poolSettings || !poolSettings.UserPool)
    throw new Error('could not load the pool settings');

  await cognito.updateUserPool({
    AccountRecoverySetting: poolSettings.UserPool.AccountRecoverySetting,
    AdminCreateUserConfig: omit(
      poolSettings.UserPool.AdminCreateUserConfig,
      'UnusedAccountValidityDays',
    ),
    AutoVerifiedAttributes: poolSettings.UserPool.AutoVerifiedAttributes,
    EmailConfiguration: poolSettings.UserPool.EmailConfiguration,
    LambdaConfig: {
      PostAuthentication: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:cognito_post_authentication_lambda_${ENV}_${DEPLOYING_COLOR}`,
      PostConfirmation: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:cognito_post_confirmation_lambda_${ENV}_${DEPLOYING_COLOR}`,
    },
    Policies: poolSettings.UserPool.Policies,
    UserPoolId: userPoolId,
    UserPoolTags: poolSettings.UserPool.UserPoolTags,
    VerificationMessageTemplate:
      poolSettings.UserPool.VerificationMessageTemplate,
  });
};

run();
