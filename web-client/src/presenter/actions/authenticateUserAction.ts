import { state } from '@web-client/presenter/app.cerebral';

/**
 * Gets the JWT token and refresh token using the cognito authorization code.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.props the cerebral props argument stream containing 'code'
 * @returns {Promise} async action
 */
export const authenticateUserAction = async ({
  applicationContext,
  path,
  props,
  store,
}: ActionProps) => {
  const { code, password } = props;

  const response = await applicationContext
    .getUseCases()
    .authenticateUserInteractor(applicationContext, {
      code,
      password,
    });

  if (response.alertError) {
    if (response.alertError.message === 'NEW_PASSWORD_REQUIRED') {
      store.set(state.login.userEmail, code);
      store.set(state.login.sessionId, response.alertError.sessionId);

      return path.newPasswordRequired({
        path: '/change-password-local',
      });
    }
    return path.no({
      alertError: response.alertError,
    });
  } else {
    return path.yes({ token: response.token });
  }
};
