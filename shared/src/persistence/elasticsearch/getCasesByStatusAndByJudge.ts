import { search } from './searchClient';

/**
 * getCasesByStatusAndByJudge
 * @param {object} providers the providers object containing applicationContext
 * @param {string} providers.applicationContext application context
 * @param {string} providers.judgeName judge
 * @param {string} providers.startDate start date
 * @param {string} providers.endDate end date
 * @param {array} providers.statuses statuses
 * @returns {array} array of docket numbers
 */
export const getCasesByStatusAndByJudge = async ({
  applicationContext,
  judgeName,
  statuses,
}) => {
  const source = [
    'caseCaption',
    'docketNumber',
    'status',
    'caseStatusHistory',
    'leadDocketNumber',
  ];

  const searchParameters = {
    body: {
      _source: source,
      query: {
        bool: {
          must: [
            {
              match_phrase: { 'associatedJudge.S': `${judgeName}` },
            },
            {
              terms: { 'status.S': statuses },
            },
          ],
        },
      },
      size: 10000,
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
    index: 'efcms-case',
  };

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return {
    foundCases: results,
    totalCount: total,
  };
};
