import { genericHandler } from '../genericHandler';

export const getCaseWorksheetInfoLambda = event =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return applicationContext
        .getUseCases()
        .getCaseWorksheetInfoInteractor(applicationContext);
    },
    { bypassMaintenanceCheck: true },
  );
