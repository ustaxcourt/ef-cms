const {
  fetchPendingItemsInteractor,
} = require('./fetchPendingItemsInteractor');
const { User } = require('../../entities/User');

describe('fetchPendingItemsInteractor', () => {
  let searchSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return {
        role: User.ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    },
    getSearchClient: () => ({
      search: searchSpy,
    }),
  };

  it('calls search function with correct params and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [
            {
              _source: {
                caseId: { S: '1' },
                documents: [{}],
              },
            },
            {
              _source: {
                caseId: { S: '2' },
                documents: [{}],
              },
            },
          ],
        },
      };
    });

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'blocked.BOOL': true },
      },
      {
        match: { 'associatedJudge.S': 'Judge Armen' },
      },
    ]);
    expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    applicationContext.getCurrentUser = () => {
      return {
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      };
    };

    let error;
    try {
      await fetchPendingItemsInteractor({
        applicationContext,
        judge: 'Judge Armen',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
