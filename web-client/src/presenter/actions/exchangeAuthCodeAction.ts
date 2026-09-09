import * as oAuthClient from 'openid-client';

export const exchangeAuthCodeAction = async ({
  applicationContext,
  props,
  path,
}: ActionProps) => {
  const { error, errorDescription } = props;
  const config = new oAuthClient.Configuration(
    {
      issuer: process.env.MANAGED_LOGIN_DOMAIN!,
      authorization_endpoint: `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/authorize`,
      token_endpoint: `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/token`,
    },
    process.env.COGNITO_CLIENT_ID!,
  );
  const code_verifier = applicationContext
    .getPersistenceGateway()
    .getItem({ key: 'code_verifier' });

  if (error) {
    return path.error({
      alertError: {
        title: error,
        message:
          errorDescription || 'Error when trying to login with Microsoft.',
      },
    });
  }

  try {
    const { accessToken, idToken, refreshToken } =
      await oAuthClient.authorizationCodeGrant(
        config,
        new window.URL(window.location.href),
        {
          pkceCodeVerifier: code_verifier,
        },
      );
    // const { accessToken, idToken, refreshToken } = await authCodeInteractor(
    //   applicationContext,
    //   authCode,
    // );

    return path.success({ accessToken, idToken, refreshToken });
  } catch (error) {
    return path.error({
      alertError: {
        message: 'Error when trying to login with Microsoft.',
      },
    });
  }
};
