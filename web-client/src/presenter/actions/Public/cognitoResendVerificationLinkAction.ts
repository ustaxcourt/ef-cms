import { state } from '@web-client/presenter/app-public.cerebral';

export const cognitoResendVerificationLinkAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const email = get(state.cognito.email);

  try {
    const { CodeDeliveryDetails } = await applicationContext
      .getUseCases()
      .cognitoResendVerificationLinkInteractor(applicationContext, {
        email,
      });

    if (CodeDeliveryDetails) {
      return path.success();
    } else {
      return path.error();
    }
  } catch (e) {
    console.log('do a flip!');
  }
};
