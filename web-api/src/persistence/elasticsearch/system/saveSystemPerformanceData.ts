import { ServerApplicationContext } from '@web-api/applicationContext';
import { getInfoSearchClient } from '@web-api/persistence/elasticsearch/getInfoSearchClient';

export type PerformanceMeasurement = {
  date: string;
  duration: number;
  eventName: string;
  environment: string;
  category: 'sequence' | 'action';
};

export const saveSystemPerformanceData = async ({
  performanceData,
}: {
  applicationContext: ServerApplicationContext;
  performanceData: PerformanceMeasurement[];
}) => {
  const client = getInfoSearchClient();

  const body: any[] = [];
  performanceData.forEach(perfData => {
    body.push({ index: {} }); // When bulk adding entries you first specify the command, then the data
    body.push(perfData);
  });

  await client.bulk({
    body,
    index: 'system-performance-logs',
  });
};
