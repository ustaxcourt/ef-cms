const {
  aggregateCommonQueryParams,
  removeAdvancedSyntaxSymbols,
} = require('./aggregateCommonQueryParams');
const {
  CASE_SEARCH_MIN_YEAR,
  COUNTRY_TYPES,
  US_STATES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { formatNow } = require('./DateHandler');

describe('aggregateCommonQueryParams', () => {
  describe('removeAdvancedSyntaxSymbols', () => {
    it('removes symbols used for advanced syntax searches', () => {
      const unsanitized = ' "({[+allow  :-no?special.=>!symbols*<]})" ';
      expect(removeAdvancedSyntaxSymbols(unsanitized)).toEqual(
        'allow no special symbols',
      );
    });
    it('preserves single-quotes in search terms', () => {
      const unchangedString = "d'Angelo's pizzeria";
      expect(removeAdvancedSyntaxSymbols(unchangedString)).toEqual(
        unchangedString,
      );
    });
  });

  it('should return an object containing aggregated query param arrays', () => {
    const result = aggregateCommonQueryParams({}, {});

    expect(result).toMatchObject({
      commonQuery: [{ match: { 'entityName.S': 'Case' } }],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerName if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerName: '+Test (-Search)',
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result.commonQuery).toMatchObject([
      { match: { 'entityName.S': 'Case' } },
    ]);

    expect(result.exactMatchesQuery).toMatchObject([
      {
        bool: {
          should: expect.arrayContaining([
            {
              simple_query_string: expect.objectContaining({
                boost: expect.any(Number),
                default_operator: 'and',
                fields: expect.any(Array),
                flags: expect.any(String),
                query: '"Test Search"',
              }),
            },
            {
              simple_query_string: expect.objectContaining({
                boost: expect.any(Number),
                default_operator: 'and',
                fields: expect.any(Array),
                flags: expect.any(String),
                query: 'Test Search',
              }),
            },
          ]),
        },
      },
    ]);

    expect(result.nonExactMatchesQuery).toMatchObject(
      expect.arrayContaining([
        {
          simple_query_string: {
            default_operator: 'or',
            fields: expect.any(Array),
            query: 'Test Search',
          },
        },
      ]),
    );
  });

  it('should include search params for countryType if present in query', () => {
    const queryParams = {
      applicationContext,
      countryType: COUNTRY_TYPES.DOMESTIC,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'petitioners.L.M.countryType.S': COUNTRY_TYPES.DOMESTIC,
                },
              },
            ],
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerState if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerState: US_STATES.AR,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'petitioners.L.M.state.S': US_STATES.AR,
                },
              },
            ],
          },
        },
        { match: { 'entityName.S': 'Case' } },
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
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should trim spaces from beginning and end of yearFiledMin and yearFiledMax if present in the query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMax: ' 2017 ',
      yearFiledMin: '            2016',
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
        { match: { 'entityName.S': 'Case' } },
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
        { match: { 'entityName.S': 'Case' } },
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
              gte: `${CASE_SEARCH_MIN_YEAR}||/y`,
              lte: '2019||/y',
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });
});
