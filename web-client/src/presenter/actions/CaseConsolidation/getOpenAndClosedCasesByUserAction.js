import { orderBy } from 'lodash';

/**
 * Fetches the cases (including consolidated) associated with the currently
 *  authenticated user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {object} open and closed case lists for the current user
 */
export const getOpenAndClosedCasesByUserAction = async ({
  applicationContext,
}) => {
  let { closedCaseList, openCaseList } = await applicationContext
    .getUseCases()
    .getCasesForUserInteractor(applicationContext);

  openCaseList = orderBy(openCaseList, 'createdAt', 'desc');

  return { closedCaseList, openCaseList };
};
