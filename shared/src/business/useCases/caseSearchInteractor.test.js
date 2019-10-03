const { caseSearchInteractor } = require('./caseSearchInteractor');

describe('caseSearchInteractor', () => {
  let searchSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getSearchClient: () => ({
      search: searchSpy,
    }),
  };

  it('returns empty array if no search params are passed in', async () => {
    searchSpy = jest.fn(async () => {
      return {};
    });

    const results = await caseSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [
            {
              _source: {
                caseId: { S: '1' },
              },
            },
            {
              _source: {
                caseId: { S: '2' },
              },
            },
          ],
        },
      };
    });

    const results = await caseSearchInteractor({
      applicationContext,
      countryType: 'domestic',
      petitionerName: 'test',
      petitionerState: 'Nebraska',
      yearFiledMax: '2019',
      yearFiledMin: '2018',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.name.S': 'test' } },
            { match: { 'contactSecondary.M.name.S': 'test' } },
          ],
        },
      },
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.countryType.S': 'domestic' } },
            { match: { 'contactSecondary.M.countryType.S': 'domestic' } },
          ],
        },
      },
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.state.S': 'Nebraska' } },
            { match: { 'contactSecondary.M.state.S': 'Nebraska' } },
          ],
        },
      },
      {
        bool: {
          should: [
            {
              range: {
                'createdAt.S': {
                  format: 'yyyy',
                  gte: '2018||/y',
                  lte: '2019||/y',
                },
              },
            },
            {
              range: {
                'receivedAt.S': {
                  format: 'yyyy',
                  gte: '2018||/y',
                  lte: '2019||/y',
                },
              },
            },
          ],
        },
      },
    ]);
    expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });
});
