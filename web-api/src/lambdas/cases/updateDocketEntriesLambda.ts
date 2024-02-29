import { genericHandler } from '../../genericHandler';

export const updateDocketEntriesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDocketEntriesInteractor(applicationContext, {
        ...JSON.parse(event.body),
        ...event.pathParameters,
      });
  });
