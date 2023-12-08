import { CognitoIdentityServiceProvider } from 'aws-sdk';
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
  async ({ get, router }) => {
    const { email, password } = get(state.form);
    console.log('in submitLoginSequence');
    console.log(email, password);

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
    const idToken = result.AuthenticationResult?.IdToken;
    router.externalRoute(`http://localhost:1234/log-in?token=${idToken}`);

    console.log('result from cognito: ', result);
    // Call some endpoint to get token & refresh token
  },
] as unknown as (props) => void;
