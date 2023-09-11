import { genericHandler } from '../genericHandler';

export const deletePrimaryIssueLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .deletePrimaryIssueInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
