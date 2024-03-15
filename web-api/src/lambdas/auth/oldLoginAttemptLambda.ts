import { ServerApplicationContext } from '@web-api/applicationContext';
import { genericHandler } from '../../genericHandler';

export const logOldLoginAttemptLambda = event =>
  genericHandler(
    event,
    ({
      applicationContext,
    }: {
      applicationContext: ServerApplicationContext;
    }) => {
      return applicationContext
        .getUseCases()
        .logOldLoginAttemptInteractor(applicationContext);
    },
  );
