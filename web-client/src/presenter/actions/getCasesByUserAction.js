import { state } from 'cerebral';
import _ from 'lodash';

/**
 * Fetches the cases associated with the petitioner who created them or the respondent who is associated with them.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.userId
 * @param {Object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {Object} contains the caseList returned from the getCasesByUser use case
 */
export default async ({ applicationContext, get }) => {
  const userId = get(state.user.userId);
  let caseList = await applicationContext.getUseCases().getCasesByUser({
    applicationContext,
    userId,
  });
  caseList = _.orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};
