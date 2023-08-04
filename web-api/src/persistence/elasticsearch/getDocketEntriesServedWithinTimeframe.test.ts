import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketEntriesServedWithinTimeframe } from './getDocketEntriesServedWithinTimeframe';

describe('getDocketEntriesServedWithinTimeframe', () => {
  it('performs a valid elasticsearch request', async () => {
    const startTimestamp = '2022-01-01T05:00:00.000Z';
    const endTimestamp = '2022-01-01T05:30:00.000Z';
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getDocketEntriesServedWithinTimeframe({
      applicationContext,
      endTimestamp,
      startTimestamp,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body[
        '_source'
      ],
    ).toEqual(['docketEntryId.S', 'docketNumber.S']);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        must: [
          {
            range: {
              'servedAt.S': {
                format: 'strict_date_time',
                gte: startTimestamp,
              },
            },
          },
          {
            range: {
              'servedAt.S': {
                format: 'strict_date_time',
                lte: endTimestamp,
              },
            },
          },
        ],
      },
    });
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
  });
});
