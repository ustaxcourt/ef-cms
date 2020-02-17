import { orderBy } from 'lodash';

/**
 * Fetches the cases associated with the petitioner who created them or the respondent who is associated with them.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {object} contains the caseList returned from the getCasesByUser use case
 */
export const getCasesByUserAction = async ({ applicationContext }) => {
  const { userId } = applicationContext.getCurrentUser();
  let caseList = await applicationContext
    .getUseCases()
    .getCasesByUserInteractor({
      applicationContext,
      userId,
    });
  caseList = orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};
