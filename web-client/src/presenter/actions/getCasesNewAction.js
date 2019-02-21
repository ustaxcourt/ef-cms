import { state } from 'cerebral';
import _ from 'lodash';

/**
 *  Gets all the cases that have a status of new.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCasesByStatus use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @returns {Object} contains the caseList returned from the getCasesByStatus use case
 */
export default async ({ applicationContext, get }) => {
  let caseList = await applicationContext.getUseCases().getCasesByStatus({
    applicationContext,
    userId: get(state.user.token),
    status: 'new',
  });
  caseList = _.orderBy(caseList, 'createdAt', 'asc');
  return { caseList };
};
