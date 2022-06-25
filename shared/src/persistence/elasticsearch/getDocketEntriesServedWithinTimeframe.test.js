const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  getDocketEntriesServedWithinTimeframe,
} = require('./getDocketEntriesServedWithinTimeframe');

describe('getDocketEntriesServedWithinTimeframe', () => {
  it('performs a valid elasticsearch request', async () => {
    const startTimestamp = '2022-01-01T05:00:00.000Z';
    const endTimestamp = '2022-01-01T05:30:00.000Z';

    await getDocketEntriesServedWithinTimeframe({
      applicationContext,
      endTimestamp,
      startTimestamp,
    });

    expect(
      // eslint-disable-next-line no-underscore-dangle
      applicationContext.getSearchClient().search.mock.calls[0][0].body._source,
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
