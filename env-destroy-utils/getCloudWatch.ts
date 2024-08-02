const { CloudWatchLogs } = require('aws-sdk');

exports.getCloudWatch = ({ environment }) => {
  const cloudWatch = new CloudWatchLogs({
    apiVersion: 'latest',
    region: environment.region,
  });

  return cloudWatch;
};
