import { ServerApplicationContext } from '@web-api/applicationContext';

export const logUserPerformanceDataInteractor = async (
  applicationContext: ServerApplicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  },
): Promise<void> => {
  console.log('performanceData', performanceData);
};
