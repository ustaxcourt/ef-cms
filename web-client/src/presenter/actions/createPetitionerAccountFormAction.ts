import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
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
  let authenticationResults: AdminCreateUserResponse;
  try {
    authenticationResults = await applicationContext
      .getUseCases()
      .createUserCognitoInteractor(applicationContext, {
        user: petitionerAccountForm,
      });
  } catch (e) {
    console.log('cognito error', e);
    return path.error({
      alertError: {
        //TODO: Ask UX about error message
        message:
          'Could not create user account, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  }

  if (Object.keys(authenticationResults).includes('UserConfirmed')) {
    return path.success({
      email: petitionerAccountForm.email,
    });
  }

  if (userExists(authenticationResults)) {
    return path.error({
      alertError: {
        alertType: 'warning',
        message: `This email address is already associated with an account. You can <a href="${cognitoLoginUrl}">log in here</a>. If you forgot your password, you can <a href="${cognitoRequestPasswordResetUrl}">request a password reset.</a>`,
        title: 'Email address already has an account',
      },
    });
  } else {
    return path.error({
      alertError: {
        //TODO: Ask UX about error message
        message:
          'Could not create user account, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  }
};

function userExists(authenticationResults: AdminCreateUserResponse) {
  console.log('Determine if user exists', authenticationResults);
  return false;
}
