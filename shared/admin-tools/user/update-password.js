const { checkEnvVar, getUserPoolId } = require('../util');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const { DEFAULT_ACCOUNT_PASS, ENV } = process.env;
checkEnvVar(ENV, 'Please have ENV set up in your local environment');

const updatePassword = async ({ email, password }) => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  const res = await cognito
    .adminSetUserPassword({
      Password: password,
      Permanent: true,
      UserPoolId,
      Username: email,
    })
    .promise();
  console.log(res);
};

(async () => {
  await updatePassword({
    email: process.argv[2],
    password: DEFAULT_ACCOUNT_PASS,
  });
})();
