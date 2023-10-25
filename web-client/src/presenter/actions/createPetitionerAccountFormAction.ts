import { CreateAccountForm } from '@shared/business/entities/CreateAccountForm';
import { state } from '@web-client/presenter/app-public.cerebral';

export const createPetitionerAccountFormAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  if (!new CreateAccountForm(get(state.form)).isValid()) {
    throw new Error('Received invalid petitioner information');
  }

  const petitionerAccountForm = new CreateAccountForm(
    get(state.form),
  ).toRawObject();

  const cognitoLoginUrl = get(state.cognitoLoginUrl);
  const cognitoRequestPasswordResetUrl = get(
    state.cognitoRequestPasswordResetUrl,
  );

  const response = await applicationContext
    .getUseCases()
    .createUserCognitoInteractor(applicationContext, {
      user: petitionerAccountForm,
    })
    .then(authenticationResults =>
      responseHandler(authenticationResults, petitionerAccountForm.email),
    )
    .catch(e =>
      errorHandler(e, cognitoLoginUrl, cognitoRequestPasswordResetUrl),
    );

  if (response.alertError) {
    return path.error(response);
  }
  return path.success(response);
};

const errorHandler = (e, cognitoLoginUrl, cognitoRequestPasswordResetUrl) => {
  console.log('e!!!!', e);
  if (e.message === 'User already exists') {
    return {
      alertError: {
        alertType: 'warning',
        message: `This email address is already associated with an account. You can <a href="${cognitoLoginUrl}">log in here</a>. If you forgot your password, you can <a href="${cognitoRequestPasswordResetUrl}">request a password reset</a>.`,
        title: 'Email address already has an account',
      },
    };
  }
  return {
    alertError: {
      //TODO: Ask UX about error message, possibly extract error message, possibly write error message creation function
      message: `Could not create user account: ${e.message}, please contact DAWSON user support`,
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
      //TODO: Ask UX about error message
      message:
        'Could not create user account, please contact DAWSON user support',
      title: 'Error creating account',
    },
  };
};
