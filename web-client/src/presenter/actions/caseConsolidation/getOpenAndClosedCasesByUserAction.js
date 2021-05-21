import { orderBy } from 'lodash';

/**
 * Fetches the cases (including consolidated) associated with the petitioner who
 *  created them or the respondent who is associated with them.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {object} contains the caseList returned from the
 *  getOpenConsolidatedCasesInteractor and getClosedCasesInteractor use cases
 */
export const getOpenAndClosedCasesByUserAction = async ({
  applicationContext,
}) => {
  let openCaseList = await applicationContext
    .getUseCases()
    .getOpenConsolidatedCasesInteractor(applicationContext);
  let closedCaseList = await applicationContext
    .getUseCases()
    .getClosedCasesInteractor(applicationContext);

  openCaseList = orderBy(openCaseList, 'createdAt', 'desc');

  return { closedCaseList, openCaseList };
};
