const {
  fetchPendingItemsInteractor,
} = require('./fetchPendingItemsInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('fetchPendingItemsInteractor', () => {
  let searchSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    },
    getUseCaseHelpers: () => ({
      fetchPendingItems: searchSpy,
    }),
  };

  it('calls fetch function and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return [
        { docketEntryId: 'def', docketNumber: '101-20', pending: true },
        { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
      ];
    });

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    applicationContext.getCurrentUser = () => {
      return {
        role: ROLES.petitioner,
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
