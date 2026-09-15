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
  const managedLoginDomain = process.env.MANAGED_LOGIN_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const idpName = process.env.IDP_NAME;
  const efcmsDomain = process.env.EFCMS_DOMAIN;
  if (!managedLoginDomain || !clientId || !idpName || !efcmsDomain)
    throw new Error('Missing env variables to perform idp login.');

  const config = new Configuration(
    {
      issuer: managedLoginDomain,
      authorization_endpoint: `${managedLoginDomain}/oauth2/authorize`,
    },
    clientId,
  );

  const code_verifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(code_verifier);

  applicationContext.getPersistenceGateway().setItem({
    key: 'code_verifier',
    value: code_verifier,
  });

  const params = {
    identity_provider: idpName || 'ustcEntra',
    redirect_uri: `https://app.${efcmsDomain}/auth-code`,
    code_challenge,
    code_challenge_method: 'S256',
  };

  const idpLoginUrl = buildAuthorizationUrl(config, params);

  router.externalRoute(idpLoginUrl);
};
