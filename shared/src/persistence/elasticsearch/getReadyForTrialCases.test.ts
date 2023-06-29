import { CASE_STATUS_TYPES } from '../../business/entities/EntityConstants';
import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getReadyForTrialCases } from './getReadyForTrialCases';
jest.mock('./searchClient');
import { search } from './searchClient';

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
        ],
        must: [
          {
            term: {
              'documentType.S': 'Answer',
            },
          },
          {
            range: {
              'createdAt.S': {
                lte: 'now-44d/d',
              },
            },
          },
          {
            has_parent: {
              inner_hits: {
                _source: {
                  includes: ['caseCaption', 'docketNumber', 'status'],
                },
                name: 'case-mappings',
              },
              parent_type: 'case',
              query: {
                bool: {
                  must: [
                    {
                      term: {
                        'status.S': CASE_STATUS_TYPES.generalDocket,
                      },
                    },
                  ],
                },
              },
              score: true,
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
