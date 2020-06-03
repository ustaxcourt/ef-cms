const { CognitoIdentity } = require('aws-sdk');

exports.getCognito = ({ environment }) => {
  const cognito = new CognitoIdentity({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return cognito;
};
