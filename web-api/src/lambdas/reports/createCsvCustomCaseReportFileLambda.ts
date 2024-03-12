import { genericHandler } from '../../genericHandler';

export const createCsvCustomCaseReportFileLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createCsvCustomCaseReportFileInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
