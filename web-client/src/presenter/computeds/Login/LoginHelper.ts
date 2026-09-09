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

  return {
    showIdpLoginButton,
    idpLoginUrl: '',
  };
};
