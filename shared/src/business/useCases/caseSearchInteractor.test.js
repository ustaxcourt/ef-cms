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
      return {
        body: {},
      };
    });

    const results = await caseSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return {
        body: {
          hits: {
            hits: [
              {
                _source: {
                  caseId: '1',
                },
              },
              {
                _source: {
                  caseId: '2',
                },
              },
            ],
          },
        },
      };
    });

    const results = await caseSearchInteractor({
      applicationContext,
      countryType: 'domestic',
      petitionerName: 'test',
      petitionerState: 'Nebraska',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        bool: {
          should: [
            { match: { 'contactPrimary.name': 'test' } },
            { match: { 'contactSecondary.name': 'test' } },
          ],
        },
      },
      {
        bool: {
          should: [
            { match: { 'contactPrimary.countryType': 'domestic' } },
            { match: { 'contactSecondary.countryType': 'domestic' } },
          ],
        },
      },
      {
        bool: {
          should: [
            { match: { 'contactPrimary.state': 'Nebraska' } },
            { match: { 'contactSecondary.state': 'Nebraska' } },
          ],
        },
      },
    ]);
    expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });
});
