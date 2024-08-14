import {
  MetricDatum,
  PutMetricDataCommand,
  PutMetricDataCommandInput,
  StandardUnit,
} from '@aws-sdk/client-cloudwatch';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const saveSystemPerformanceData = async ({
  applicationContext,
  performanceData,
}: {
  applicationContext: ServerApplicationContext;
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  };
}) => {
  const { stage } = applicationContext.getEnvironment();

  const cloudwatchClient = applicationContext.getCloudWatchClient();
  const metricData: MetricDatum[] = [
    {
      Dimensions: [
        { Name: 'SequenceName', Value: performanceData.sequenceName },
      ],
      MetricName: 'SequenceDuration',
      Unit: 'Seconds',
      Value: performanceData.duration,
    },
    ...performanceData.actionPerformanceArray.map(action => ({
      Dimensions: [
        { Name: 'SequenceName', Value: performanceData.sequenceName },
        { Name: 'ActionName', Value: action.actionName },
      ],
      MetricName: 'ActionPerformance',
      Unit: 'Seconds' as StandardUnit,
      Value: action.duration,
    })),
  ];

  const params: PutMetricDataCommandInput = {
    MetricData: metricData,
    Namespace: `System-Performance-Log-${stage}`,
  };

  const command = new PutMetricDataCommand(params);

  await cloudwatchClient.send(command);
};
