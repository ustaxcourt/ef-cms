import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  Configuration,
  randomPKCECodeVerifier,
} from 'openid-client';

export const idpLoginAction = async ({
  router,
  applicationContext,
}: ActionProps) => {
  const config = new Configuration(
    {
      issuer: process.env.MANAGED_LOGIN_DOMAIN!,
      authorization_endpoint: `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/authorize`,
    },
    process.env.COGNITO_CLIENT_ID!,
  );

  const code_verifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(code_verifier);

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

  const idpLoginUrl = buildAuthorizationUrl(config, params);

  router.externalRoute(idpLoginUrl);
};
