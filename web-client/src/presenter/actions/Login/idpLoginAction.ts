import * as oAuthClient from 'openid-client';

export const idpLoginAction = async ({
  router,
  applicationContext,
}: ActionProps) => {
  const config = new oAuthClient.Configuration(
    {
      issuer: process.env.MANAGED_LOGIN_DOMAIN!,
      authorization_endpoint: `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/authorize`,
      token_endpoint: `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/token`,
    },
    process.env.COGNITO_CLIENT_ID!,
  );

  const code_verifier = oAuthClient.randomPKCECodeVerifier();
  const code_challenge =
    await oAuthClient.calculatePKCECodeChallenge(code_verifier);

  applicationContext.getPersistenceGateway().setItem({
    key: 'code_verifier',
    value: code_verifier,
  });

  const params = {
    identity_provider: process.env.IDP_NAME || 'ustcEntra',
    redirect_uri: `https://app.${process.env.EFCMS_DOMAIN}/auth-code`,
    code_challenge,
    code_challenge_method: 'S256',
  };

  const idpLoginUrl = oAuthClient.buildAuthorizationUrl(config, params);

  router.externalRoute(idpLoginUrl);
};
