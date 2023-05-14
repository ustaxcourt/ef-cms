import { search } from './searchClient';

/**
 * getBlockedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
export const getBlockedCases = async ({
  applicationContext,
  trialLocation,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'automaticBlocked',
          'automaticBlockedDate',
          'automaticBlockedReason',
          'blocked',
          'blockedDate',
          'blockedReason',
          'caseCaption',
          'docketNumber',
          'docketNumberSuffix',
          'docketNumberWithSuffix',
          'leadDocketNumber',
          'status',
          'procedureType',
        ],
        query: {
          bool: {
            must: [
              { term: { 'preferredTrialCity.S': trialLocation } },
              {
                bool: {
                  should: [
                    { match: { 'automaticBlocked.BOOL': true } },
                    { match: { 'blocked.BOOL': true } },
                  ],
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  });

  return results;
};
