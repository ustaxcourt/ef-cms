const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getReadyForTrialCases } = require('./getReadyForTrialCases');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getReadyForTrialCases', () => {
  it('should search for docket entries of type `Answer` which were served greater than 45 days ago and whose case status is `General Docket - Not at Issue`', async () => {
    search.mockResolvedValue({
      results: [{ docketNumber: '102-20' }, { docketNumber: '134-30' }],
      total: 2,
    });

    await getReadyForTrialCases({
      applicationContext,
    });

    expect(search.mock.calls[0][0].searchParameters.body.query).toMatchObject({
      bool: {
        filter: [
          {
            term: {
              'entityName.S': 'DocketEntry',
            },
          },
          {
            exists: {
              field: 'servedAt',
            },
          },
        ],
        must: [
          {
            term: {
              'documentType.S': 'Answer',
            },
          },
          {
            range: {
              'servedAt.S': {
                lte: 'now-44d/d',
              },
            },
          },
          {
            simple_query_string: {
              default_operator: 'and',
              fields: ['status.S'],
              flags: 'OR|AND|ESCAPE|PHRASE',
              query: CASE_STATUS_TYPES.generalDocket,
            },
          },
        ],
        must_not: [
          {
            term: {
              'isStricken.BOOL': true,
            },
          },
        ],
      },
    });
  });
});
