import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { state } from '@web-client/presenter/app-public.cerebral';

export const createPetitionerAccountFormAction = ({
  get,
  path,
}: ActionProps) => {
  const resultsDict = {
    emailAlreadyExist: {},
    success: { User: {} },
  };

  const authenticationResults: AdminCreateUserResponse = resultsDict.success;

  if (authenticationResults.User) {
    return path.success({
      email:
        authenticationResults.User.Attributes?.find(x => x.Name === 'email')
          ?.Value || get(state.form.email), //TODO: clean up getting from state right now just to see it on verification page
    });
  }
  if (userExists(authenticationResults)) {
    return path.error({
      alertWarning: {
        message:
          'That email address is already associated with and account. If you forgot your password, you can request a password reset',
        title: 'Email address already has an account',
      },
    });
  } else {
    return path.error({
      alertError: {
        message: authenticationResults.errorMessage,
        title: 'Error creating account',
      },
    });
  }
};

function userExists(authenticationResults: AdminCreateUserResponse) {
  authenticationResults.true = true;
  return authenticationResults.true;
}
