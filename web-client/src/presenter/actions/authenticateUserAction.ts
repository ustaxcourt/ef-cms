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
}: ActionProps) => {
  const { code } = props;

  const response = await applicationContext
    .getUseCases()
    .authenticateUserInteractor(applicationContext, {
      code,
    });

  if (response.alertError) {
    return path.no({ alertError: response.alertError });
  } else {
    return path.yes({ token: response.token });
  }
};
