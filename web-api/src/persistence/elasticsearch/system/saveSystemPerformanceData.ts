import { ServerApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';

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
  const client = applicationContext.getInfoSearchClient();
  await client.index({
    body: {
      ...performanceData,
      date: createISODateString(),
    },
    index: 'system-performance-logs',
  });
};
