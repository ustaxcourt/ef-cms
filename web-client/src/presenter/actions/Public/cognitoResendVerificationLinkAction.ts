import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { state } from '@web-client/presenter/app-public.cerebral';

export const cognitoResendVerificationLinkAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
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
      return path.error({
        alertError: {
          alertType: 'error',
          message: 'Please check your spam folder.',
          title: 'Unable to resend confirmation link',
        },
      });
    }
  } catch (e) {
    return path.error({
      alertError: {
        //TODO: Ask UX about error message
        alertType: 'error',
        message:
          'Could not resend verification link, please contact DAWSON user support',
        title: 'Unable to resend confirmation link',
      },
    });
  }
};
