import { post } from '@shared/proxies/requests';

export const logUserPerformanceDataInteractor = (
  applicationContext,
  performanceData: { [actionName: string]: number[] },
): Promise<void> => {
  return post({
    applicationContext,
    body: performanceData,
    endpoint: '/log/performance-data',
  });
};
