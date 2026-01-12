import {
  AbbreviatedStates,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PROCEDURE_TYPES_MAP,
  US_STATES,
} from '../entities/EntityConstants';
import {
  aggregateCommonQueryParams,
  removeAdvancedSyntaxSymbols,
} from './aggregateCommonQueryParams';

describe('aggregateCommonQueryParams', () => {
  describe('removeAdvancedSyntaxSymbols', () => {
    it('removes symbols used for advanced syntax searches', () => {
      const unsanitized = ' ({[+allow  :-no?special.=>!symbols*<]}) ';
      expect(removeAdvancedSyntaxSymbols(unsanitized)).toEqual(
        'allow no special. symbols',
      );
    });

    it('preserves single-quotes in search terms', () => {
      const unchangedString = "d'Angelo's pizzeria";
      expect(removeAdvancedSyntaxSymbols(unchangedString)).toEqual(
        unchangedString,
      );
    });

    it('preserves double-quotes in search terms', () => {
      const unchangedString = '"this exact string"';
      expect(removeAdvancedSyntaxSymbols(unchangedString)).toEqual(
        unchangedString,
      );
    });
  });

  it('should return an object containing aggregated query param arrays', () => {
    const result = aggregateCommonQueryParams({
      petitionerName: '',
    });

    expect(result).toMatchObject({
      commonQuery: [{ match: { 'entityName.S': 'Case' } }],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerName if present in query', () => {
    const queryParams = {
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
      petitionerName: '',
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
      petitionerName: '',
      petitionerState: US_STATES.AR as AbbreviatedStates,
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

  it('should include search params for startDate and endDate if present in query', () => {
    const queryParams = {
      endDate: '2020-12-11T15:25:55.006Z',
      startDate: '2018-12-11T15:25:55.006Z',
      petitionerName: '',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'strict_date_optional_time',
              gte: queryParams.startDate,
              lte: queryParams.endDate,
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should trim spaces from beginning and end of startDate and endDate if present in the query', () => {
    const queryParams = {
      petitionerName: '',
      endDate: ' 2020-12-11T15:25:55.006Z ',
      startDate: '            2018-12-11T15:25:55.006Z',
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'strict_date_optional_time',
              gte: queryParams.startDate,
              lte: queryParams.endDate,
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for caseType if present in query', () => {
    const queryParams = {
      petitionerName: '',
      caseTypes: [CASE_TYPES_MAP.cdp],
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        { match: { 'entityName.S': 'Case' } },
        { terms: { 'caseType.S': queryParams.caseTypes } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for procedureType if present in query', () => {
    const queryParams = {
      petitionerName: '',
      procedureType: PROCEDURE_TYPES_MAP.regular,
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        { match: { 'entityName.S': 'Case' } },
        { match: { 'procedureType.S': PROCEDURE_TYPES_MAP.regular } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });
});
