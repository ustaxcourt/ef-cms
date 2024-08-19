import { ServerApplicationContext } from '@web-api/applicationContext';

export const saveSystemPerformanceData = async ({
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
  console.log('DETERMINE WHERE TO SAVE THIS DATA HERE', performanceData);
};
