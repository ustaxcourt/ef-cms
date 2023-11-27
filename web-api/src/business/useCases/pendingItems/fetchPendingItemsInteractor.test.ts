import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { fetchPendingItemsInteractor } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';

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
      fetchPendingItemsInteractor(applicationContext, {
        judge: 'Judge Colvin',
      } as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the judge is not defined', async () => {
    await expect(
      fetchPendingItemsInteractor(applicationContext, {
        judge: undefined,
      } as any),
    ).rejects.toThrow('judge is required');
  });

  it('should call fetchPendingItems from persistence and return the results', async () => {
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([
        { docketEntryId: 'def', docketNumber: '101-20', pending: true },
        { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
      ]);

    const results = await fetchPendingItemsInteractor(applicationContext, {
      judge: 'Judge Colvin',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });
});
