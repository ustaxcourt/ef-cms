import { state } from 'cerebral';

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
  const { code, cognitoLocal } = props;

  const response = await applicationContext
    .getUseCases()
    .authenticateUserInteractor(applicationContext, {
      code,
      cognitoLocal,
    });

  if (response.alertError) {
    // TODO: consider creating authenticateUserLocalAction
    if (response.alertError === 'NEW_PASSWORD_REQUIRED') {
      store.set(state.cognitoLocal.userEmail, code);
      store.set(state.cognitoLocal.sessionId, response.sessionId);

      return path.newPasswordRequired({
        path: '/change-password-local',
      });
    }
    return path.no({
      alertError: {
        message: response.alertError.message,
        title: response.alertError.title
          ? response.alertError.title
          : response.alertError,
      },
    });
  } else {
    return path.yes({ token: response.token });
  }
};
