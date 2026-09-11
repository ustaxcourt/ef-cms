import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'node_modules/cerebral';

type LoginHelperType = {
  showIdpLoginButton: boolean;
  idpLoginUrl: string;
};

export const loginHelper = (get: Get): LoginHelperType => {
  const showIdpLoginButton =
    !!process.env.IDP_NAME &&
    !!get(state.featureFlags[ALLOWLIST_FEATURE_FLAGS.ALLOW_IDP_LOGIN.key]);

  const idpLoginParams = new URLSearchParams();
  idpLoginParams.append('identity_provider', process.env.IDP_NAME || '');
  idpLoginParams.append(
    'redirect_uri',
    `https://app.${process.env.EFCMS_DOMAIN}/auth-code`,
  );
  idpLoginParams.append('response_type', 'CODE');
  idpLoginParams.append('client_id', process.env.COGNITO_CLIENT_ID || '');

  const idpLoginUrl = `${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/authorize?${idpLoginParams.toString()}`;

  return {
    showIdpLoginButton,
    idpLoginUrl,
  };
};
