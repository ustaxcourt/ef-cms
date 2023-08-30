import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersWithServedEventCodes } from './getDocketNumbersWithServedEventCodes';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('getDocketNumbersWithServedEventCodes', () => {
  const prohibitedDocketEntries = ['ODD', 'DEC', 'OAD', 'SDEC'];
  const requestParams: {
    cases: RawCase[];
    eventCodes: string[];
  } = {
    cases: [],
    eventCodes: prohibitedDocketEntries,
  };

  let mockReturnValue;

  beforeAll(() => {
    (search as jest.Mock).mockImplementation(() => mockReturnValue);
  });

  it('searches within specified for prescribed docket entries that are served and not stricken', async () => {
    mockReturnValue = { results: [], total: 0 };
    requestParams.cases = [MOCK_CASE];
    await getDocketNumbersWithServedEventCodes(
      applicationContext,
      requestParams,
    );

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body,
    ).toMatchObject({
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': [MOCK_CASE.docketNumber],
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

  it('searches for all cases with prescribed docket entries that are served and not stricken', async () => {
    mockReturnValue = { results: [], total: 0 };
    requestParams.cases = [];

    await getDocketNumbersWithServedEventCodes(
      applicationContext,
      requestParams,
    );

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body,
    ).toMatchObject({
      query: {
        bool: {
          must: [
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

  it('returns an empty array if nothing was found', async () => {
    mockReturnValue = { results: [], total: 0 };
    const result = await getDocketNumbersWithServedEventCodes(
      applicationContext,
      requestParams,
    );

    expect(result).toEqual([]);
  });

  it('returns an array  of docket numbers found', async () => {
    mockReturnValue = {
      results: [{ docketNumber: MOCK_CASE.docketNumber }],
      total: 1,
    };
    const result = await getDocketNumbersWithServedEventCodes(
      applicationContext,
      requestParams,
    );

    expect(result).toEqual([MOCK_CASE.docketNumber]);
  });
});
