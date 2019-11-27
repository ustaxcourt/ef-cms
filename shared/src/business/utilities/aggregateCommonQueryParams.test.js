const { aggregateCommonQueryParams } = require('./aggregateCommonQueryParams');
const { CaseSearch } = require('../entities/cases/CaseSearch');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { formatNow } = require('./DateHandler');

let applicationContext;

describe('aggregateCommonQueryParams', () => {
  beforeEach(() => {
    applicationContext = {
      getUtilities: () => ({
        formatNow,
      }),
    };
  });
  it('should return an object containing aggregated query param arrays', () => {
    const result = aggregateCommonQueryParams({}, {});

    expect(result).toMatchObject({
      commonQuery: [],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerName if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerName: 'Test Search',
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [],
      exactMatchesQuery: [
        {
          bool: {
            should: [
              {
                bool: {
                  minimum_should_match: 2,
                  should: [
                    {
                      term: {
                        'contactPrimary.M.name.S': 'test',
                      },
                    },
                    {
                      term: {
                        'contactPrimary.M.name.S': 'search',
                      },
                    },
                  ],
                },
              },
              {
                bool: {
                  minimum_should_match: 2,
                  should: [
                    {
                      term: {
                        'contactPrimary.M.secondaryName.S': 'test',
                      },
                    },
                    {
                      term: {
                        'contactPrimary.M.secondaryName.S': 'search',
                      },
                    },
                  ],
                },
              },
              {
                bool: {
                  minimum_should_match: 2,
                  should: [
                    {
                      term: {
                        'contactSecondary.M.name.S': 'test',
                      },
                    },
                    {
                      term: {
                        'contactSecondary.M.name.S': 'search',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      nonExactMatchesQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'contactPrimary.M.name.S': 'Test Search',
                },
              },
              {
                match: {
                  'contactPrimary.M.secondaryName.S': 'Test Search',
                },
              },
              {
                match: {
                  'contactSecondary.M.name.S': 'Test Search',
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('should include search params for countryType if present in query', () => {
    const queryParams = {
      applicationContext,
      countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'contactPrimary.M.countryType.S':
                    ContactFactory.COUNTRY_TYPES.DOMESTIC,
                },
              },
              {
                match: {
                  'contactSecondary.M.countryType.S':
                    ContactFactory.COUNTRY_TYPES.DOMESTIC,
                },
              },
            ],
          },
        },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerState if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerState: ContactFactory.US_STATES.AR,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'contactPrimary.M.state.S': ContactFactory.US_STATES.AR,
                },
              },
              {
                match: {
                  'contactSecondary.M.state.S': ContactFactory.US_STATES.AR,
                },
              },
            ],
          },
        },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMin and yearFiledMax if present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMax: '2017',
      yearFiledMin: '2016',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: '2016||/y',
              lte: '2017||/y',
            },
          },
        },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMin if present in query and default yearFiledMax if not present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMin: '2018',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: '2018||/y',
              lte: `${formatNow('YYYY')}||/y`,
            },
          },
        },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMax if present in query and default yearFiledMin if not present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMax: '2019',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: `${CaseSearch.CASE_SEARCH_MIN_YEAR}||/y`,
              lte: '2019||/y',
            },
          },
        },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });
});
