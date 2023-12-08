import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { state } from '@web-client/presenter/app-public.cerebral';

export const submitLoginSequence = [
  async ({ applicationContext, get }: ActionProps) => {
    const { email, password } = get(state.form);
    console.log('in submitLoginSequence');
    console.log(email, password);

    // Call Cognito
    const cognito = new CognitoIdentityServiceProvider({
      endpoint: 'http://localhost:9229/',
      httpOptions: {
        connectTimeout: 3000,
        timeout: 5000,
      },
      maxRetries: 3,
      region: 'local',
    });

    const result = await cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          PASSWORD: password,
          USERNAME: email,
        },
        ClientId: applicationContext.getCognitoClientId(),
      })
      .promise();

    console.log('result from cognito: ', result);
    // Call some endpoint to get token & refresh token
  },
] as unknown as (props) => void;
