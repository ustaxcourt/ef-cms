import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getColdCases } from './getColdCases';

describe('getColdCases', () => {
  it('returns the expected results with the dates formatted and the cases sorted by filingDate oldest to newest', async () => {
    applicationContext.getSearchClient().search.mockResolvedValue({
      body: {
        hits: {
          hits: [
            {
              _source: {
                createdAt: {
                  S: '2023-08-25T04:00:00.000Z',
                },
                docketNumber: {
                  S: '102-24',
                },
              },
              inner_hits: {
                most_recent_child: {
                  hits: {
                    hits: [
                      {
                        _source: {
                          eventCode: {
                            S: 'O',
                          },
                          filingDate: {
                            S: '2023-08-25T04:00:00.000Z',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              _source: {
                createdAt: {
                  S: '2023-08-25T04:00:00.000Z',
                },
                docketNumber: {
                  S: '101-24',
                },
              },
              inner_hits: {
                most_recent_child: {
                  hits: {
                    hits: [
                      {
                        _source: {
                          eventCode: {
                            S: 'O',
                          },
                          filingDate: {
                            S: '2023-08-25T04:00:00.000Z',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              _source: {
                createdAt: {
                  S: '2023-08-25T04:00:00.000Z',
                },
                docketNumber: {
                  S: '101-20',
                },
              },
              inner_hits: {
                most_recent_child: {
                  hits: {
                    hits: [
                      {
                        _source: {
                          eventCode: {
                            S: 'A',
                          },
                          filingDate: {
                            S: '2019-08-25T04:00:00.000Z',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    });

    const results = await getColdCases({
      applicationContext,
    });

    expect(results).toMatchObject([
      {
        createdAt: '08/25/2023',
        docketNumber: '101-20',
        eventCode: 'A',
        filingDate: '08/25/2019',
      },
      {
        createdAt: '08/25/2023',
        docketNumber: '101-24',
        eventCode: 'O',
        filingDate: '08/25/2023',
      },
      {
        createdAt: '08/25/2023',
        docketNumber: '102-24',
        eventCode: 'O',
        filingDate: '08/25/2023',
      },
    ]);
  });
});
