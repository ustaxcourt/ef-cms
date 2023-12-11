import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
//import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import {
  InvalidPasswordException,
  NotAuthorizedException,
  UserNotConfirmedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { state } from '@web-client/presenter/app-public.cerebral';

const cognito = new CognitoIdentityServiceProvider({
  endpoint: 'http://localhost:9229/',
  httpOptions: {
    connectTimeout: 3000,
    timeout: 5000,
  },
  maxRetries: 3,
  region: 'local',
});

export const submitLoginSequence = [
  async ({ get, path, router }) => {
    const { email, password } = get(state.form);
    console.log('in submitLoginSequence');
    console.log(email, password);

    try {
      const result = await cognito
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            PASSWORD: password,
            USERNAME: email,
          },
          ClientId: 'bvjrggnd3co403c0aahscinne',
        })
        .promise();

      console.log('result from cognito: ', result);

      const idToken = result.AuthenticationResult?.IdToken;
      const refreshToken = result.AuthenticationResult?.RefreshToken;
      console.log(
        `http://localhost:1234/log-in?token=${idToken}&refreshToken=${refreshToken}`
          .length,
      );
      router.externalRoute(
        `http://localhost:1234/log-in?token=${idToken}&refreshToken=${refreshToken}`,
      );
    } catch (e) {
      console.log('an error occurred', e);

      // if (e instanceof UserNotConfirmedException) {
      //   return path.error({
      //     alertError: {
      //       alertType: 'error',
      //       message:
      //         'The email address is associated with an account but is not verified. We sent an email with a link to verify the email address. If you don’t see it, check your spam folder. If you’re still having trouble, email dawson.support@ustaxcourt.gov.',
      //       title: 'Email address not verified',
      //     },
      //   });
      // }

      // if (
      //   e instanceof NotAuthorizedException ||
      //   e instanceof InvalidPasswordException
      // ) {
      //   return path.error({
      //     alertError: {
      //       alertType: 'error',
      //       message: 'The email address or password you entered is invalid.',
      //       title: 'Please correct the following errors:',
      //     },
      //   });
      // }
    }

    // Call some endpoint to get token & refresh token

    // TODO: Return Alert Success if User Verifies Account
    // return {
    //   alertSuccess: {
    //     message: '',
    //     title: '',
    //   },
    // };
  },
  // {
  //   error: [setAlertErrorAction],
  //   success: [setAlertSuccessAction],
  // },
] as unknown as (props) => void;
