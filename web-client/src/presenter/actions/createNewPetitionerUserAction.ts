import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app-public.cerebral';

export const createNewPetitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  if (!new NewPetitionerUser(get(state.form)).isValid()) {
    throw new Error('Received invalid petitioner information');
  }

  const petitionerAccountForm = new NewPetitionerUser(
    get(state.form),
  ).toRawObject();

  const cognitoRequestPasswordResetUrl = get(
    state.cognitoRequestPasswordResetUrl,
  );

  const response = await applicationContext
    .getUseCases()
    .signUpUserInteractor(applicationContext, {
      user: petitionerAccountForm,
    })
    .then(authenticationResults =>
      responseHandler(authenticationResults, petitionerAccountForm.email),
    )
    .catch(e => errorHandler(e, cognitoRequestPasswordResetUrl));

  if (response.alertError) {
    return path.error(response);
  }
  return path.success(response);
};

const errorHandler = (e, cognitoRequestPasswordResetUrl) => {
  const originalErrorMessage = e?.originalError?.response?.data;
  if (originalErrorMessage === 'User already exists') {
    return {
      alertError: {
        alertType: 'warning',
        message: `This email address is already associated with an account. You can <a href="/login">log in here</a>. If you forgot your password, you can <a href="${cognitoRequestPasswordResetUrl}">request a password reset</a>.`,
        title: 'Email address already has an account',
      },
    };
  } else if (originalErrorMessage === 'User exists, email unconfirmed') {
    return {
      alertError: {
        alertType: 'error',
        message:
          "The email address is associated with an account but is not verified. We sent an email with a link to verify the email address. If you don't see it, check your spam folder. If you're still having trouble, please contact <a href='mailto:dawson.support@ustaxcourt.gov'>dawson.support@ustaxcourt.gov</a>.",
        title: 'Email address not verified',
      },
    };
  }
  return {
    alertError: {
      message:
        'Could not create user account, please contact DAWSON user support',
      title: 'Error creating account',
    },
  };
};

const responseHandler = (
  authenticationResults,
  email,
): { alertError?: object; email?: string } => {
  if (Object.keys(authenticationResults).includes('UserConfirmed')) {
    return {
      email,
    };
  }
  return {
    alertError: {
      message:
        'Could not parse authentication results, please contact DAWSON user support',
      title: 'Error creating account',
    },
  };
};
