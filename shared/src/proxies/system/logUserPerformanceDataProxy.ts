import { post } from '@shared/proxies/requests';

export const logUserPerformanceDataInteractor = (
  applicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  },
) => {
  return post({
    applicationContext,
    body: { performanceData },
    endpoint: '/system/log/performance-data',
  });
};
