export const getCasesByFilters = async ({ applicationContext, params }) => {
  const params = {
    caseStatuses: [],
    caseTypes: [],
    createEndDate: '',
    createStartDate: '',
    paperFilingMethods: [],
  };
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  'receivedAt.S': {
                    gte: computeDate({ day: 1, month: 1, year: 2021 }),
                    lt: computeDate({ day: 1, month: 11, year: 2021 }),
                  },
                },
              },
              {
                match: {
                  'isPaper.BOOL': true,
                },
                // },
                // {
                //   match: {
                //     'caseType.S': 'Whistleblower',
                //   },
              },
            ],
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-case',
      size: 10000,
    },
  });
  return results;
};
