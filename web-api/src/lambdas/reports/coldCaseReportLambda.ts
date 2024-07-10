import { genericHandler } from '../../genericHandler';

export const coldCaseReportLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .coldCaseReportInteractor(applicationContext);
  });
