import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { state } from '@web-client/presenter/app-public.cerebral';

export const resendVerificationLinkAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const email = get(state.cognito.email);

  try {
    const { CodeDeliveryDetails } = await applicationContext
      .getUseCases()
      .resendVerificationLinkInteractor(applicationContext, {
        email,
      });
    if (CodeDeliveryDetails) {
      return path.success({
        alertSuccess: {
          alertType: 'success',
          message: `Verification email was sent again to ${email}.`,
          title: 'Email re-sent',
        },
      });
    } else {
      return path.error({
        alertError: {
          alertType: 'error',
          message:
            'Unable parse out the code delivery details, please contact DAWSON user support',
          title: 'Unable to resend confirmation link',
        },
      });
    }
  } catch (e) {
    return path.error({
      alertError: {
        alertType: 'error',
        message:
          'Could not resend verification link, please contact DAWSON user support',
        title: 'Unable to resend confirmation link',
      },
    });
  }
};
