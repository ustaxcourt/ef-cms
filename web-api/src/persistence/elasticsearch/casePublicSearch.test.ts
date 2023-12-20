import { CasePublicSearchRequestType } from '@shared/business/useCases/public/casePublicSearchInteractor';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { casePublicSearch } from './casePublicSearch';
jest.mock('./searchClient');
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';

describe('casePublicSearch', () => {
  const searchTerms: CasePublicSearchRequestType = {
    petitionerName: 'test person',
  };

  search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

  const mustClause = [
    {
      bool: {
        should: [
          {
            simple_query_string: {
              boost: 20,
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              query: '"test person"',
            },
          },
          {
            simple_query_string: {
              boost: 0.5,
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              query: 'test person',
            },
          },
        ],
      },
    },
    {
      match: {
        'entityName.S': 'Case',
      },
    },
  ];

  const mustNotClause = [
    {
      bool: {
        should: [
          {
            simple_query_string: {
              boost: 20,
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              query: '"test person"',
            },
          },
          {
            simple_query_string: {
              boost: 0.5,
              default_operator: 'and',
              fields: ['petitioners.L.M.name.S^4', 'caseCaption.S^0.2'],
              flags: 'AND|PHRASE|PREFIX',
              query: 'test person',
            },
          },
        ],
      },
    },
    {
      match: {
        'entityName.S': 'Case',
      },
    },
  ];

  it('returns results from an exact-matches query', async () => {
    await casePublicSearch({
      applicationContext,
      searchTerms,
    });

    const expectedQuery = {
      bool: {
        must: mustClause,
        must_not: mustNotClause,
      },
    };
    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0].searchParameters.body.size).toEqual(
      MAX_SEARCH_RESULTS,
    );

    expect(search.mock.calls[0][0].searchParameters.body.query).toEqual(
      expectedQuery,
    );
  });
});
