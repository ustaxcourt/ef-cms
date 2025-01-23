import { ServerApplicationContext } from '@web-api/applicationContext';
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
}: {
  applicationContext: ServerApplicationContext;
  trialLocation: string;
}): Promise<any> => {
  const { results: blockedCaseResults } = await search({
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

  const leadDocketNumbers = blockedCaseResults
    .map(c => c.leadDocketNumber)
    .filter(docketNumber => docketNumber);

  const { results: consolidatedCaseSearchResults } = await search({
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
            ],
            should: [
              {
                bool: {
                  should: [
                    { match: { 'automaticBlocked.BOOL': true } },
                    { match: { 'blocked.BOOL': true } },
                  ],
                },
              },
              {
                terms: {
                  'leadDocketNumber.S': leadDocketNumbers,
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

  return consolidatedCaseSearchResults;
};
