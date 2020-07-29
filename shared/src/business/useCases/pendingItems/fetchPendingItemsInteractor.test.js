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
        { docketNumber: '101-20', documentId: 'def', pending: true },
        { docketNumber: '201-20', documentId: 'abc', pending: true },
      ];
    });

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { docketNumber: '101-20', documentId: 'def', pending: true },
      { docketNumber: '201-20', documentId: 'abc', pending: true },
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
