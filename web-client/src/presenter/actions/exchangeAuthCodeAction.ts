import { authCodeInteractor } from '@web-client/proxies/auth/authCodeProxy';

export const exchangeAuthCodeAction = async ({
  applicationContext,
  props,
  path,
}: ActionProps) => {
  const { authCode, error, errorDescription } = props;

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
    const { accessToken, idToken, refreshToken } = await authCodeInteractor(
      applicationContext,
      authCode,
    );

    return path.success({ accessToken, idToken, refreshToken });
  } catch (error) {
    return path.error({
      alertError: {
        message: 'Error when trying to login with Microsoft.',
      },
    });
  }
};
