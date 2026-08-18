import { authCodeInteractor } from '@web-client/proxies/auth/authCodeProxy';

export const exchangeAuthCodeAction = async ({
  applicationContext,
  props,
  path,
}: ActionProps) => {
  const { authCode } = props;

  const { accessToken, idToken, refreshToken } = await authCodeInteractor(
    applicationContext,
    authCode,
  );

  return path.success({ accessToken, idToken, refreshToken });
};
