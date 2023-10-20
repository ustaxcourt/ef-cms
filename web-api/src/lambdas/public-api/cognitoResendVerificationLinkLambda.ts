import { genericHandler } from '../../genericHandler';

export const cognitoResendVerificationLinkLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .cognitoResendVerificationLinkInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { user: {} },
  );
