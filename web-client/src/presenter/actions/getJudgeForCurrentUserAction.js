/**
 * gets the associated judge for the current user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {object} Associated Judge user object if found
 */
export const getJudgeForCurrentUserAction = async ({ applicationContext }) => {
  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext);

  if (judgeUser) {
    return { judgeUser };
  }
};
