import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { count, search, searchAll } from './searchClient';
import {
  emptyResults,
  mockDocketEntrySearchResult,
  mockMalformedQueryResult,
  mockMessageSearchResult,
  mockNonexistentDocumentCountResult,
  mockOpenCasesReceivedOnJulyFourthCountResult,
  mockOpenCasesReceivedOnJulyFourthFormattedResults,
  mockOpenCasesReceivedOnJulyFourthSearchResult1,
  mockOpenCasesReceivedOnJulyFourthSearchResult2,
  mockOpenCasesReceivedOnJulyFourthSearchResults,
  mockWorkItemSearchResult,
  openCasesReceivedOnJulyFourthSearchParameters,
} from './searchClient.test.constants';
import { formatDocketEntryResult } from './helpers/formatDocketEntryResult';
import { formatMessageResult } from './helpers/formatMessageResult';
import { formatWorkItemResult } from './helpers/formatWorkItemResult';

jest.mock('./helpers/formatMessageResult', () => ({
  formatMessageResult: jest.fn(),
}));
jest.mock('./helpers/formatDocketEntryResult', () => ({
  formatDocketEntryResult: jest.fn(),
}));
jest.mock('./helpers/formatWorkItemResult.ts', () => ({
  formatWorkItemResult: jest.fn(),
}));

describe('searchClient', () => {
  describe('search', () => {
    it('search should throw and log an error when a query exception is thrown by elasticsearch', async () => {
      applicationContext
        .getSearchClient()
        .search.mockImplementation(() =>
          Promise.reject(
            new Error('malformed elasticsearch query syntax error'),
          ),
        );

      await expect(
        search({
          applicationContext,
          // @ts-ignore TS2322 - intentionally invalid request
          searchParameters: { some: '[bad: $syntax -=error' },
        }),
      ).rejects.toThrow('Search client encountered an error.');

      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    });

    it('search should return an empty list with total 0 when no search results are found', async () => {
      applicationContext.getSearchClient().search.mockReturnValue(emptyResults);

      const results = await search({
        applicationContext,
        searchParameters: {},
      });

      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        1,
      );
      expect(results).toMatchObject({ results: [], total: 0 });
    });

    it('search should format and return the list of results when the results are docket entry entities', async () => {
      applicationContext
        .getSearchClient()
        .search.mockReturnValue(mockDocketEntrySearchResult);

      await search({
        applicationContext,
        searchParameters: {},
      });

      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        1,
      );
      expect(formatDocketEntryResult).toHaveBeenCalledTimes(1);
    });

    it('search should format and return the list of results when they are message search results', async () => {
      applicationContext
        .getSearchClient()
        .search.mockReturnValue(mockMessageSearchResult);

      await search({
        applicationContext,
        searchParameters: {},
      });

      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        1,
      );
      expect(formatMessageResult).toHaveBeenCalledTimes(1);
    });

    it('should format and return the list of results when they are work item search results', async () => {
      applicationContext
        .getSearchClient()
        .search.mockReturnValue(mockWorkItemSearchResult);

      await search({
        applicationContext,
        searchParameters: {},
      });

      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        1,
      );
      expect(formatWorkItemResult).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchAll', () => {
    it('searchAll should not perform a search query when the count query is malformed', async () => {
      applicationContext
        .getSearchClient()
        .count.mockReturnValue(mockMalformedQueryResult);

      await searchAll({
        applicationContext,
        searchParameters: {
          body: {},
          index: 'efcms-docket-entry',
        },
      });

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        0,
      );
      expect(formatMessageResult).toHaveBeenCalledTimes(0);
    });

    it("searchAll should not perform a search query if the count query's results are empty", async () => {
      applicationContext
        .getSearchClient()
        .count.mockReturnValue(mockNonexistentDocumentCountResult);

      await searchAll({
        applicationContext,
        searchParameters: {
          body: {
            query: {
              bool: {
                must: {
                  term: {
                    'docketNumber.S': '101-76',
                  },
                },
              },
            },
            sort: [{ 'filingDate.S': 'asc' }],
          },
          index: 'efcms-docket-entry',
        },
      });

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        0,
      );
      expect(formatMessageResult).toHaveBeenCalledTimes(0);
    });

    it('searchAll should perform additional search queries if the count is greater than the batch size', async () => {
      const openCasesSearchParameters = {
        ...openCasesReceivedOnJulyFourthSearchParameters,
        size: 5,
      };

      applicationContext
        .getSearchClient()
        .count.mockReturnValue(mockOpenCasesReceivedOnJulyFourthCountResult);
      applicationContext
        .getSearchClient()
        .search.mockReturnValueOnce(
          mockOpenCasesReceivedOnJulyFourthSearchResult1,
        );
      applicationContext
        .getSearchClient()
        .search.mockReturnValueOnce(
          mockOpenCasesReceivedOnJulyFourthSearchResult2,
        );

      const openCasesReceivedOnJulyFourthSearchAllResults = await searchAll({
        applicationContext,
        searchParameters: openCasesSearchParameters,
      });

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        2,
      );
      expect(openCasesReceivedOnJulyFourthSearchAllResults).toEqual({
        ...mockOpenCasesReceivedOnJulyFourthFormattedResults.body,
        expected: 7,
      });
      expect(openCasesReceivedOnJulyFourthSearchAllResults.total).toEqual(
        openCasesReceivedOnJulyFourthSearchAllResults.expected,
      );
    });

    it('searchAll should return the same results that search returns', async () => {
      // 1 - run query with searchAll

      const openCasesReceivedOnJulyFourthSearchAllParameters = {
        ...openCasesReceivedOnJulyFourthSearchParameters,
        size: 5,
      };

      applicationContext
        .getSearchClient()
        .count.mockReturnValue(mockOpenCasesReceivedOnJulyFourthCountResult);
      applicationContext
        .getSearchClient()
        .search.mockReturnValueOnce(
          mockOpenCasesReceivedOnJulyFourthSearchResult1,
        );
      applicationContext
        .getSearchClient()
        .search.mockReturnValueOnce(
          mockOpenCasesReceivedOnJulyFourthSearchResult2,
        );

      const openCasesReceivedOnJulyFourthSearchAllResults = await searchAll({
        applicationContext,
        searchParameters: openCasesReceivedOnJulyFourthSearchAllParameters,
      });

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
        2,
      );
      expect(openCasesReceivedOnJulyFourthSearchAllResults).toEqual({
        ...mockOpenCasesReceivedOnJulyFourthFormattedResults.body,
        expected: 7,
      });
      expect(openCasesReceivedOnJulyFourthSearchAllResults.total).toEqual(
        openCasesReceivedOnJulyFourthSearchAllResults.expected,
      );

      // 2 - run query with search

      applicationContext
        .getSearchClient()
        .search.mockReturnValueOnce(
          mockOpenCasesReceivedOnJulyFourthSearchResults,
        );

      const openCasesReceivedOnJulyFourthSearchResults = await search({
        applicationContext,
        searchParameters: openCasesReceivedOnJulyFourthSearchParameters,
      });

      expect(openCasesReceivedOnJulyFourthSearchResults).toEqual(
        mockOpenCasesReceivedOnJulyFourthFormattedResults.body,
      );

      // 3 - compare the results

      expect(openCasesReceivedOnJulyFourthSearchResults.total).toEqual(
        openCasesReceivedOnJulyFourthSearchAllResults.total,
      );
    });

    it('searchAll should log an error and throw an error if the count query throws an error', async () => {
      const mockError = new Error();
      applicationContext.getSearchClient().count.mockImplementation(() => {
        throw mockError;
      });

      await expect(
        searchAll({
          applicationContext,
          searchParameters: {},
        }),
      ).rejects.toThrow();

      expect(applicationContext.logger.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe('count', () => {
    const mockCountResult = {
      body: {
        count: 5,
      },
    };
    it('count should throw and log an error when a query exception is thrown by elasticsearch', async () => {
      applicationContext
        .getSearchClient()
        .count.mockImplementation(() =>
          Promise.reject(
            new Error('malformed elasticsearch query syntax error'),
          ),
        );

      await expect(
        count({
          applicationContext,
          // @ts-ignore TS2322 - intentionally invalid request
          searchParameters: { some: '[bad: $syntax -=error' },
        }),
      ).rejects.toThrow('Search client encountered an error.');

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    });

    it('returns 0 if no results were found', async () => {
      applicationContext
        .getSearchClient()
        .count.mockReturnValue(mockCountResult);

      const result = await count({
        applicationContext,
        searchParameters: {},
      });

      expect(applicationContext.getSearchClient().count).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBe(5);
    });
  });

  describe('formatResults', () => {
    it.todo('returns the total number of hits it found in the results');
    it.todo('returns any aggregrations it found in the results');
    it.todo('removes case_relations from any hit it found');
    it.todo('unmarshalls the data it within each hit');
    it.todo('includes the score');
    it.todo(
      'if calls helper functions that are docket entries, messages, or work items',
    );
  });
});
