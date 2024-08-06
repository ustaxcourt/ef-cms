import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';

let cloudwatchCache: CloudWatchLogsClient;

export const getCloudWatch = ({
  environment,
}: {
  environment: { name: string; region: string };
}) => {
  if (!cloudwatchCache) {
    cloudwatchCache = new CloudWatchLogsClient({
      region: environment.region,
    });
  }
  return cloudwatchCache;
};
