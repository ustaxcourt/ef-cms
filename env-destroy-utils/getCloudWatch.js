const { CloudWatchLogs } = require('aws-sdk');

exports.getCloudWatch = ({ environment }) => {
  const cloudWatch = new CloudWatchLogs({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    credentials: environment.credentials,
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return cloudWatch;
};
