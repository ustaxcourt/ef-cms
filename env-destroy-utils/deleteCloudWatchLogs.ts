import {
  DeleteLogGroupCommand,
  DescribeLogGroupsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { getCloudWatch } from './getCloudWatch';

export const deleteCloudWatchLogs = async ({
  environment,
}: {
  environment: { name: string; region: string };
}): Promise<void> => {
  const cloudWatchLogs = getCloudWatch({ environment });

  let logGroups = await cloudWatchLogs.send(new DescribeLogGroupsCommand({}));
  let envToDestroyLogGroups =
    logGroups.logGroups?.filter(group =>
      group.logGroupName?.includes(environment.name),
    ) || [];

  do {
    logGroups = await cloudWatchLogs.send(
      new DescribeLogGroupsCommand({ nextToken: logGroups.nextToken }),
    );

    const moreEnvToDestroyLogGroups =
      logGroups.logGroups?.filter(group =>
        group.logGroupName?.includes(environment.name),
      ) || [];
    envToDestroyLogGroups = envToDestroyLogGroups.concat(
      moreEnvToDestroyLogGroups,
    );
  } while (logGroups.nextToken);

  for (const group of envToDestroyLogGroups) {
    console.log('Deleting CloudWatch log group: ', group.logGroupName);

    await cloudWatchLogs.send(
      new DeleteLogGroupCommand({ logGroupName: group.logGroupName }),
    );
  }
};
