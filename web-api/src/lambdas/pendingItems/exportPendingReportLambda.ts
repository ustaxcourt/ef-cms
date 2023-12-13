import { genericHandler } from '../../genericHandler';

export const exportPendingReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .exportPendingReportInteractor(applicationContext, {
          ...event.queryStringParameters,
        });
    },
    { logResults: false },
  );
