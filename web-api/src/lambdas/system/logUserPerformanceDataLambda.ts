import { genericHandler } from '@web-api/genericHandler';

export const logUserPerformanceDataLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { performanceData } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .logUserPerformanceDataInteractor(applicationContext, performanceData);
  });
