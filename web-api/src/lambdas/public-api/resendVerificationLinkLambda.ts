import { genericHandler } from '../../genericHandler';

export const resendVerificationLinkLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .resendVerificationLinkInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { user: {} },
  );
