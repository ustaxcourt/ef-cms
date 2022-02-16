/* eslint-disable max-lines */
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  BENCH_OPINION_EVENT_CODE,
} = require('../../../business/entities/EntityConstants');
const {
  getJudgeFilterForOpinionSearch,
} = require('../getJudgeFilterForOpinionSearch');
const { search } = require('../searchClient');
jest.mock('./searchClient');

describe('getJudgeFilterForOpinionSearch', () => {
  const opinionEventCodes = ['MOP', 'TCOP'];

  const SOURCE = {
    includes: [
      'caseCaption',
      'docketEntryId',
      'docketNumber',
      'docketNumberWithSuffix',
      'documentTitle',
      'documentType',
      'eventCode',
      'filingDate',
      'irsPractitioners',
      'isFileAttached',
      'isSealed',
      'isStricken',
      'judge',
      'numberOfPages',
      'petitioners',
      'privatePractitioners',
      'sealedDate',
      'sealedTo',
      'signedJudgeName',
    ],
  };

  const opinionQueryParams = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      terms: {
        'eventCode.S': [opinionEventCodes[0], opinionEventCodes[1]],
      },
    },
  ];

  const getCaseMappingQueryParams = (caseTitleOrPetitioner, docketNumber) => {
    let query = {
      bool: {
        filter: [],
      },
    };

    if (caseTitleOrPetitioner) {
      query.bool.must = {
        simple_query_string: {
          default_operator: 'and',
          fields: ['caseCaption.S', 'petitioners.L.M.name.S'],
          flags: 'OR|AND|ESCAPE|PHRASE',
          query: caseTitleOrPetitioner,
        },
      };
    }

    if (docketNumber) {
      query.bool.filter.push({
        term: {
          'docketNumber.S': docketNumber,
        },
      });
    }

    return {
      has_parent: {
        inner_hits: {
          _source: SOURCE,
          name: 'case-mappings',
        },
        parent_type: 'case',
        query,
        score: true,
      },
    };
  };

  beforeEach(() => {
    search.mockReturnValue({ results: [], total: 0 });
  });

  it('does a search for a signed judge when searching for bench opinions', async () => {
    await getJudgeFilterForOpinionSearch({
      applicationContext,
      documentEventCodes: [BENCH_OPINION_EVENT_CODE],
      isOpinionSearch: true,
      judge: 'Judge Guy Fieri',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      getCaseMappingQueryParams(null), // match all parents
      {
        bool: {
          should: [
            {
              match: {
                'judge.S': 'Guy Fieri',
              },
            },
            {
              match: {
                'signedJudgeName.S': {
                  operator: 'and',
                  query: 'Guy Fieri',
                },
              },
            },
          ],
        },
      },
    ]);
  });

  it('does a search for a judge when searching for opinions', async () => {
    await getJudgeFilterForOpinionSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      isOpinionSearch: true,
      judge: 'Judge Guy Fieri',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool,
    ).toMatchObject({
      filter: expect.arrayContaining(opinionQueryParams),
      must: [
        getCaseMappingQueryParams(null), // match all parents
        {
          bool: {
            should: [
              {
                match: {
                  'judge.S': 'Guy Fieri',
                },
              },
              {
                match: {
                  'signedJudgeName.S': {
                    operator: 'and',
                    query: 'Guy Fieri',
                  },
                },
              },
            ],
          },
        },
      ],
      must_not: expect.anything(),
    });
  });

  describe('judge filter search', () => {
    //todo: change this name
    it('should strip out the "Chief" title from a judge\'s name', async () => {
      await getJudgeFilterForOpinionSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        isOpinionSearch: true,
        judge: 'Chief Guy Fieri',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must[1].bool
          .should[0].match,
      ).toEqual({
        'judge.S': 'Guy Fieri',
      });
    });

    it('should strip out the "Legacy" title from a judge\'s name', async () => {
      await getJudgeFilterForOpinionSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        judge: 'Legacy Guy Fieri',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must[1].bool
          .should.match,
      ).toEqual({
        'signedJudgeName.S': {
          operator: 'and',
          query: 'Guy Fieri',
        },
      });
    });

    it('should strip out the "Judge" title from a judge\'s name', async () => {
      await getJudgeFilterForOpinionSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        isOpinionSearch: true,
        judge: 'Legacy Judge Guy Fieri',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must[1].bool
          .should[0].match,
      ).toEqual({ 'judge.S': 'Guy Fieri' });
    });
  });
});
