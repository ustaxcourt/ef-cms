import { search } from './searchClient';

/**
 * getFirstSingleCaseRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the items found and the total count
 */
export const getFirstSingleCaseRecord = async ({ applicationContext }) => {
  const results = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber'],
        query: {
          match_all: {},
        },
        size: 1,
      },
      index: 'efcms-case',
    },
  });

  return results;
};
