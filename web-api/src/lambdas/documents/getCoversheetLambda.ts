import { genericHandler } from '../../genericHandler';

export const getCoversheetLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await applicationContext
        .getUseCases()
        .getCoversheetInteractor(applicationContext, event.pathParameters);
    },
    { logResults: false },
  );
