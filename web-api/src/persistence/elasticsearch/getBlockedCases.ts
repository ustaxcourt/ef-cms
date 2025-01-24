import { applicationContext } from '@web-api/applicationContext';
import { search } from './searchClient';
import { Case } from '@shared/business/entities/cases/Case';

export const getBlockedCases = async ({
  trialLocation,
}: {
  trialLocation: string;
}): Promise<BlockedCasesResponse> => {
  const { results: blockedCaseResults } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source as unknown as string[],
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
        _source: source as unknown as string[],
        query: {
          bool: {
            must: [
              { term: { 'preferredTrialCity.S': trialLocation } },
              {
                bool: {
                  should: [
                    {
                      terms: {
                        'leadDocketNumber.S': leadDocketNumbers, // Are you in a consolidated group with a blocked case
                      },
                    },
                    {
                      match: {
                        'automaticBlocked.BOOL': true,
                      },
                    },
                    {
                      match: {
                        'blocked.BOOL': true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        size: 10000,
      },
      index: 'efcms-case',
    },
  });

  return consolidatedCaseSearchResults;
};

const source = [
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
] as const;

export type BlockedCasesResponse = Pick<Case, (typeof source)[number]>[];
