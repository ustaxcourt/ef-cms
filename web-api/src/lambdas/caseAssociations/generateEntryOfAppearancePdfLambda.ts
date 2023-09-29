import { genericHandler } from '../../genericHandler';

export const generateEntryOfAppearancePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .generateEntryOfAppearancePdfInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
