import { genericHandler } from '../../genericHandler';

export const deleteDocketEntryWorksheetLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .deleteDocketEntryWorksheetInteractor(
        applicationContext,
        event.pathParameters.docketEntryId,
      );
  });
