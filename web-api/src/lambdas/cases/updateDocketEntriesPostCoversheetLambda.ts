import { genericHandler } from '../../genericHandler';

export const updateDocketEntriesPostCoversheetLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDocketEntriesPostCoversheetInteractor(applicationContext, {
        ...JSON.parse(event.body),
        ...event.pathParameters,
      });
  });
