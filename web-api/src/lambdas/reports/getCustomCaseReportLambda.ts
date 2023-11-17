import { genericHandler } from '../../genericHandler';

export const getCustomCaseReportLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCustomCaseReportInteractor(
        applicationContext,
        event.queryStringParameters,
      );
  });
