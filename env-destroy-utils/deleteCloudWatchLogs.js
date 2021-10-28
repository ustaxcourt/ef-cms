const { getCloudWatch } = require('./getCloudWatch');

exports.deleteCloudWatchLogs = async ({ environment }) => {
  const cloudWatchLogs = getCloudWatch({ environment });

  let logGroups = await cloudWatchLogs.describeLogGroups().promise();
  let envToDestroyLogGroups = logGroups.logGroups.filter(group =>
    group.logGroupName.includes(environment.name),
  );

  do {
    logGroups = await cloudWatchLogs
      .describeLogGroups({ nextToken: logGroups.nextToken })
      .promise();

    envToDestroyLogGroups = envToDestroyLogGroups.concat(
      logGroups.logGroups.filter(group =>
        group.logGroupName.includes(environment.name),
      ),
    );
  } while (logGroups.nextToken);

  for (const group of envToDestroyLogGroups) {
    await cloudWatchLogs
      .deleteLogGroup({ logGroupName: group.logGroupName })
      .promise();
  }
};
