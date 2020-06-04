import { orderBy } from 'lodash';

/**
 * Fetches the cases (including consolidated) associated with the petitioner who created them or the respondent who is associated with them.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @param {object} providers.status the status determining the type of cases to be retrieved
 * @returns {object} contains the caseList returned from the getCasesByUser use case
 */
export const getConsolidatedCasesByUserAction = async ({
  applicationContext,
}) => {
  let openCaseList = await applicationContext
    .getUseCases()
    .getOpenConsolidatedCasesInteractor({
      applicationContext,
    });

  let closedCaseList = await applicationContext
    .getUseCases()
    .getClosedCasesInteractor({
      applicationContext,
    });

  openCaseList = orderBy(openCaseList, 'createdAt', 'desc');
  closedCaseList = orderBy(closedCaseList, 'createdAt', 'desc');
  return { closedCaseList, openCaseList };
};
