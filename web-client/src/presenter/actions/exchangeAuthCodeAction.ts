import { authCodeInteractor } from '@web-client/proxies/auth/authCodeProxy';

export const exchangeAuthCodeAction = async ({
  applicationContext,
  props,
  path,
}: ActionProps) => {
  const { authCode, state, error, errorDescription } = props;

  if (error) {
    return path.error({
      alertError: {
        title: error,
        message:
          errorDescription || 'Error when trying to login with Microsoft.',
      },
    });
  }

  const code_verifier = applicationContext
    .getPersistenceGateway()
    .getItem({ key: 'code_verifier' });

  const auth_state = applicationContext.getPersistenceGateway().getItem({
    key: 'auth_state',
  });

  if (auth_state !== state) {
    return path.error({
      alertError: {
        title: 'Bad State',
        message: 'Stored state did not match returned state.',
      },
    });
  }

  try {
    const { accessToken, idToken, refreshToken } = await authCodeInteractor(
      applicationContext,
      authCode,
      code_verifier,
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
