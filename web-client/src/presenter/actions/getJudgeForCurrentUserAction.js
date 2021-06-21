/**
 * gets the associated judge for the current user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {object} Associated Judge user object if found
 */
export const getJudgeForCurrentUserAction = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext, {
      user,
    });

  if (judgeUser) {
    return { judgeUser };
  }
};
