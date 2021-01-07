import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTodaysOrdersAction } from './getTodaysOrdersAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('getTodaysOrdersAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the searchResults and totalCount of results', async () => {
    const mockTodaysOrders = [
      {
        docketEntryId: '1234',
        documentTitle: 'An order',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another order',
      },
    ];
    const mockTotalCount = 2;
    applicationContext.getUseCases().getTodaysOrdersInteractor.mockReturnValue({
      results: mockTodaysOrders,
      totalCount: mockTotalCount,
    });

    const result = await runAction(getTodaysOrdersAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.todaysOrders).toMatchObject(mockTodaysOrders);
    expect(result.output.totalCount).toBe(mockTotalCount);
  });
});
