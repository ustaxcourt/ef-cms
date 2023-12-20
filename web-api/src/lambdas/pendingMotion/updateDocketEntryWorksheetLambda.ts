import { genericHandler } from '../../genericHandler';

export const updateDocketEntryWorksheetLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDocketEntryWorksheetInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
