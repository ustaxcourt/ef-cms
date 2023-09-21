import { genericHandler } from '../../genericHandler';

export const updateCaseWorksheetLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
