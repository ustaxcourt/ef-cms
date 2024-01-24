import { genericHandler } from '../../genericHandler';

export const logClientErrorLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .logClientErrorInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
