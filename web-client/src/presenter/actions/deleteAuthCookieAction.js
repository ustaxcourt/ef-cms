/**
 * deletes the auth cookie by calling the logout /auth endpoint
 *
 * @returns {Promise} async action
 */
export const deleteAuthCookieAction = async ({ applicationContext }) => {
  await applicationContext
    .getUseCases()
    .deleteAuthCookieInteractor(applicationContext);
};
