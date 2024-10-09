import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { search } from './searchClient';

export const getSuggestedCalendarCases = async ({ applicationContext }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketNumber',
          'preferredTrialCity',
          'procedureType',
          'status',
        ],
        query: {
          bool: {
            must: [
              {
                term: {
                  'status.S': CASE_STATUS_TYPES.generalDocketReadyForTrial,
                },
              },
              {
                exists: {
                  field: 'preferredTrialCity',
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

  return results;
};
