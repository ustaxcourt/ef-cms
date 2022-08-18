const { search } = require('./searchClient');

exports.getDocketEntriesServedWithinTimeframe = async ({
  applicationContext,
  endTimestamp,
  startTimestamp,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketEntryId.S', 'docketNumber.S'],
        query: {
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
        },
        size: 10000,
      },
      index: 'efcms-docket-entry',
    },
  });

  return results;
};
