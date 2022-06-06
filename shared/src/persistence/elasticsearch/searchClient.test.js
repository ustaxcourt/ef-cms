const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  formatDocketEntryResult,
} = require('./helpers/formatDocketEntryResult');
const { formatMessageResult } = require('./helpers/formatMessageResult');
const { search } = require('./searchClient');
jest.mock('./helpers/formatMessageResult', () => ({
  formatMessageResult: jest.fn(),
}));
jest.mock('./helpers/formatDocketEntryResult', () => ({
  formatDocketEntryResult: jest.fn(),
}));

describe('searchClient', () => {
  const emptyResults = {
    _shards: { failed: 0, skipped: 0, successful: 1, total: 1 },
    hits: {
      hits: [],
      max_score: null,
      total: { relation: 'eq', value: 0 },
    },
    timed_out: false,
    took: 66,
  };

  it('should throw and log an error when a query exception is thrown by elasticsearch', async () => {
    applicationContext
      .getSearchClient()
      .search.mockImplementation(() =>
        Promise.reject(new Error('malformed elasticsearch query syntax error')),
      );

    await expect(
      search({
        applicationContext,
        searchParameters: { some: '[bad: $syntax -=error' },
      }),
    ).rejects.toThrow('Search client encountered an error.');

    expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
      1,
    );
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
  });

  it('should return an empty list with total 0 when no search results are found', async () => {
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

  it('should format and return the list of results when the results are docket entry entities', async () => {
    const mockDocketEntrySearchResult = {
      _shards: {
        failed: 0,
        skipped: 0,
        successful: 1,
        total: 1,
      },
      hits: {
        hits: [
          {
            _id: 'case|312-21_docket-entry|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            _index: 'efcms-docket-entry',
            _routing: 'case|312-21_case|312-21|mapping',
            _score: null,
            _source: {
              messageId: {
                S: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
                docketNumber: {
                  S: '312-21',
                },
              },
            },
            _type: '_doc',
            inner_hits: {
              'case-mappings': {
                hits: {
                  hits: [
                    {
                      _id: 'case|312-21_case|312-21|mapping',
                      _index: 'efcms-message',
                      _score: 1,
                      _source: {
                        docketNumber: {
                          S: '312-21',
                        },
                      },
                      _type: '_doc',
                    },
                  ],
                  max_score: 1,
                  total: {
                    relation: 'eq',
                    value: 1,
                  },
                },
              },
            },
            sort: [1629483399420],
          },
        ],
        max_score: null,
        total: {
          relation: 'eq',
          value: 1,
        },
      },
      timed_out: false,
      took: 5,
    };

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

  it('should format and return the list of results when they are message search results', async () => {
    const mockMessageSearchResult = {
      _shards: {
        failed: 0,
        skipped: 0,
        successful: 1,
        total: 1,
      },
      hits: {
        hits: [
          {
            _id: 'case|312-21_message|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            _index: 'efcms-message',
            _routing: 'case|312-21_case|312-21|mapping',
            _score: null,
            _source: {
              messageId: {
                S: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
                docketNumber: {
                  S: '312-21',
                },
              },
            },
            _type: '_doc',
            inner_hits: {
              'case-mappings': {
                hits: {
                  hits: [
                    {
                      _id: 'case|312-21_case|312-21|mapping',
                      _index: 'efcms-message',
                      _score: 1,
                      _source: {
                        leadDocketNumber: {
                          S: '312-21',
                        },
                      },
                      _type: '_doc',
                    },
                  ],
                  max_score: 1,
                  total: {
                    relation: 'eq',
                    value: 1,
                  },
                },
              },
            },
            sort: [1629483399420],
          },
        ],
        max_score: null,
        total: {
          relation: 'eq',
          value: 1,
        },
      },
      timed_out: false,
      took: 5,
    };

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
});
