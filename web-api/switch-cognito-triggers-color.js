const AWS = require('aws-sdk');

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

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const getUserPoolId = async () => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

const getIrsUserPoolId = async () => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-irs-${ENV}`,
  ).Id;
  return userPoolId;
};

const run = async () => {
  const userPoolId = await getUserPoolId();
  await cognito
    .updateUserPool({
      LambdaConfig: {
        PostAuthentication: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:cognito_post_authentication_lambda_${ENV}_${DEPLOYING_COLOR}`,
        PostConfirmation: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:cognito_post_confirmation_lambda_${ENV}_${DEPLOYING_COLOR}`,
      },
      UserPoolId: userPoolId,
    })
    .promise();

  const irsUserPoolId = await getIrsUserPoolId();
  await cognito
    .updateUserPool({
      LambdaConfig: {
        PostAuthentication: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:cognito_post_authentication_lambda_${ENV}_${DEPLOYING_COLOR}`,
      },
      UserPoolId: irsUserPoolId,
    })
    .promise();
};

run();
