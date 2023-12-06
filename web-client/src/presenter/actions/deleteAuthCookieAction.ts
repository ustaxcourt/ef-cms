/**
 * deleteAuthCookieAction deletes the auth cookie by calling the logout endpoint
 * @param {object} applicationContext an object
 * @param {object} applicationContext.applicationContext the application context
 */
export const deleteAuthCookieAction = async ({
  applicationContext,
}: ActionProps) => {
  await applicationContext
    .getUseCases()
    .deleteAuthCookieInteractor(applicationContext);
};
