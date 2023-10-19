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

  const cognitoLoginUrl = get(state.cognitoLoginUrl);
  const cognitoRequestPasswordResetUrl = get(
    state.cognitoRequestPasswordResetUrl,
  );
  const authenticationResults: AdminCreateUserResponse =
    resultsDict.emailAlreadyExist;

  if (authenticationResults.User) {
    return path.success({
      email:
        authenticationResults.User.Attributes?.find(x => x.Name === 'email')
          ?.Value || get(state.form.email), //TODO: clean up getting from state right now just to see it on verification page
    });
  }
  if (userExists(authenticationResults)) {
    return path.error({
      alertError: {
        alertType: 'warning',
        message: `This email address is already associated with and account. You can <a href="${cognitoLoginUrl}">log in here</a>. If you forgot your password, you can <a href="${cognitoRequestPasswordResetUrl}">request a password reset</a>`,
        title: 'Email address already has an account',
      },
    });
  } else {
    return path.error({
      alertError: {
        message: getErrorMessageFromResults(authenticationResults),
        title: 'Error creating account',
      },
    });
  }
};

function userExists(authenticationResults: AdminCreateUserResponse) {
  console.log('Determine if user exists', authenticationResults);
  return true;
}

function getErrorMessageFromResults(
  authenticationResults: AdminCreateUserResponse,
): string {
  console.log('Extract errpr message from results', authenticationResults);
  return 'Error message from AWS cognito';
}
