import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesByEventCodes } from './getCasesByEventCodes';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('getCasesByEventCodes', () => {
  const prohibitedDocketEntries = ['ODD', 'DEC', 'OAD', 'SDEC'];
  const mockCaseOne = '101-20';

  beforeAll(() => {
    search.mockReturnValue({ results: {}, total: 0 });
  });

  it('should search for all cases with prescribed docket entries that are served and not stricken', async () => {
    const requestParams = {
      cases: [
        {
          docketNumber: mockCaseOne,
        },
      ],
      eventCodes: prohibitedDocketEntries,
    };

    await getCasesByEventCodes({
      applicationContext,
      params: requestParams,
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject({
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': [mockCaseOne],
              },
            },
            {
              has_child: {
                query: {
                  bool: {
                    filter: [
                      {
                        terms: {
                          'eventCode.S': prohibitedDocketEntries,
                        },
                      },
                      {
                        exists: {
                          field: 'servedAt',
                        },
                      },
                      {
                        term: {
                          'isStricken.BOOL': false,
                        },
                      },
                    ],
                  },
                },
                type: 'document',
              },
            },
          ],
        },
      },
      size: MAX_ELASTICSEARCH_PAGINATION,
    });
  });
});
