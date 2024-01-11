import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app.cerebral';

export const createNewPetitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  // TODO 10007: Do we need to be parsing results like this? Should we be looking directly at the cognito results?
  if (!new NewPetitionerUser(get(state.form)).isValid()) {
    throw new Error('Received invalid petitioner information');
  }

  const petitionerAccountForm = new NewPetitionerUser(
    get(state.form),
  ).toRawObject();

  try {
    const response = await applicationContext
      .getUseCases()
      .signUpUserInteractor(applicationContext, {
        user: petitionerAccountForm,
      });

    return path.success(response);
  } catch (err) {
    const originalErrorMessage = err?.originalError?.response?.data;
    if (originalErrorMessage === 'User already exists') {
      return path.warning({
        alertWarning: {
          title: 'Email address already has an account',
        },
      });
    } else if (originalErrorMessage === 'User exists, email unconfirmed') {
      return path.error({
        alertError: {
          message:
            "The email address is associated with an account but is not verified. We sent an email with a link to verify the email address. If you don't see it, check your spam folder. If you're still having trouble, please contact <a href='mailto:dawson.support@ustaxcourt.gov'>dawson.support@ustaxcourt.gov</a>.",
          title: 'Email address not verified',
        },
      });
    }
    return path.error({
      alertError: {
        message:
          'Could not create user account, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  }
};
