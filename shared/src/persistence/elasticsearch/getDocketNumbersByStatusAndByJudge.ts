import { search } from './searchClient';

/**
 * getCasesByStatusAndByJudge
 * @param {object} providers the providers object containing applicationContext
 * @param {string} providers.applicationContext application context
 * @param {string} providers.judgeName judge
 * @returns {array} array of docketNumbers with field based on source
 */
export const getDocketNumbersByStatusAndByJudge = async ({
  applicationContext,
  judgeName,
  statuses,
}) => {
  const source = ['docketNumber'];

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

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  return results;
};
