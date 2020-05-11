const { CognitoIdentity } = require('aws-sdk');

exports.getCognito = ({ environment }) => {
  const cognito = new CognitoIdentity({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    credentials: environment.credentials,
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return cognito;
};
