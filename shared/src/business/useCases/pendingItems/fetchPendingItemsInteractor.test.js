const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fetchPendingItemsInteractor,
} = require('./fetchPendingItemsInteractor');
const { isCodeEnabled } = require('../../../../../codeToggles.js');
const { ROLES } = require('../../entities/EntityConstants');
jest.mock('../../../../../codeToggles.js');

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

  it('should call fetchPendingItems from persistence when 7134 bug fix is enabled and return the results', async () => {
    isCodeEnabled.mockReturnValue(true);
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([
        { docketEntryId: 'def', docketNumber: '101-20', pending: true },
        { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
      ]);

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Colvin',
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });

  it('should call fetchPendingItems from useCaseHelpers when 7134 bug fix is disabled and return the results', async () => {
    isCodeEnabled.mockReturnValue(false);
    applicationContext.getUseCaseHelpers().fetchPendingItems.mockReturnValue([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);

    const results = await fetchPendingItemsInteractor({
      applicationContext,
      judge: 'Judge Colvin',
    });

    expect(
      applicationContext.getUseCaseHelpers().fetchPendingItems,
    ).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });
});
