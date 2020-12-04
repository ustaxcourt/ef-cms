const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fetchPendingItemsInteractor,
} = require('./fetchPendingItemsInteractor.old');
const { ROLES } = require('../../entities/EntityConstants');

describe('fetchPendingItemsInteractor', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  it('should throw an unauthorized error when the user does not have access to blocked cases', async () => {
    mockUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      fetchPendingItemsInteractor({
        applicationContext,
        judge: 'Judge Colvin',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the judge is not defined', async () => {
    await expect(
      fetchPendingItemsInteractor({
        applicationContext,
        judge: undefined,
      }),
    ).rejects.toThrow('judge is required');
  });

  it('should call fetchPendingItems from useCaseHelpers and return the results', async () => {
    applicationContext
      .getUseCaseHelpers()
      .fetchPendingItemsOld.mockReturnValue([
        { docketEntryId: 'def', docketNumber: '101-20', pending: true },
        { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
      ]);

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Colvin',
    });

    expect(
      applicationContext.getUseCaseHelpers().fetchPendingItemsOld,
    ).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });
});
