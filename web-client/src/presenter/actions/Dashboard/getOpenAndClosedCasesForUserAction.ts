/**
 * Fetches the cases (including consolidated) associated with the currently
 * authenticated user.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {object} open and closed case lists for the current user
 */
export const getOpenAndClosedCasesForUserAction = async ({
  applicationContext,
}: ActionProps) => {
  const { closedCaseList, openCaseList } = await applicationContext
    .getUseCases()
    .getCasesForUserInteractor(applicationContext);

  return { closedCaseList, openCaseList };
};
