import _ from 'lodash';

/**
 *  Gets all the cases that have a status of new.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCasesByStatus use case
 * @returns {Object} contains the caseList returned from the getCasesByStatus use case
 */
export default async ({ applicationContext }) => {
  let caseList = await applicationContext.getUseCases().queryForCases({
    applicationContext,
    status: 'new',
  });
  caseList = _.orderBy(caseList, 'createdAt', 'asc');
  return { caseList };
};
