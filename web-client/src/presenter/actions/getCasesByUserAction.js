import _ from 'lodash';

/**
 * Fetches the cases associated with the petitioner who created them or the respondent who is associated with them.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCasesByUser use case
 * @returns {Object} contains the caseList returned from the getCasesByUser use case
 */
export default async ({ applicationContext }) => {
  let caseList = await applicationContext.getUseCases().queryForCases({
    applicationContext,
  });
  caseList = _.orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};
