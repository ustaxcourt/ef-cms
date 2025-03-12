import '@web-api/persistence/postgres/cases/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { fetchPendingItemsInteractor } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { fetchPendingItems as fetchPendingItemsMock } from '@web-api/persistence/postgres/cases/reports/fetchPendingItems';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('fetchPendingItemsInteractor', () => {
  const fetchPendingItems = fetchPendingItemsMock as jest.Mock;
  it('should throw an unauthorized error when the user does not have access to blocked cases', async () => {
    await expect(
      fetchPendingItemsInteractor(
        applicationContext,
        {
          judge: 'Judge Colvin',
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the judge is not defined', async () => {
    await expect(
      fetchPendingItemsInteractor(
        applicationContext,
        {
          judge: undefined,
        } as any,
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('judge is required');
  });

  it('should call fetchPendingItems from persistence and return the results', async () => {
    fetchPendingItems.mockReturnValue([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);

    const results = await fetchPendingItemsInteractor(
      applicationContext,
      {
        judge: 'Judge Colvin',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(fetchPendingItems).toHaveBeenCalled();
    expect(results).toEqual([
      { docketEntryId: 'def', docketNumber: '101-20', pending: true },
      { docketEntryId: 'abc', docketNumber: '201-20', pending: true },
    ]);
  });
});
