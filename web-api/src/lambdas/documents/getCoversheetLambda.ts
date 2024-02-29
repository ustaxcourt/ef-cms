import { genericHandler } from '../../genericHandler';

export const getCoversheetLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCoversheetInteractor(applicationContext, event.pathParameters);
    },
    { logResults: false },
  );
