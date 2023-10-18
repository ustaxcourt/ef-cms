import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const createPetitionerAccountFormAction = ({ path }: ActionProps) => {
  const resultsDict = {
    emailAlreadyExist: {},
    success: { User: {} },
  };

  const authenticationResults: AdminCreateUserResponse = resultsDict.success;

  if (authenticationResults.User) {
    return path.success({
      email: authenticationResults.User.Attributes?.find(
        x => x.Name === 'email',
      )?.Value,
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
