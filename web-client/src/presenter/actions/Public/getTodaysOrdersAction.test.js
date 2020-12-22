import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTodaysOrdersAction } from './getTodaysOrdersAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('getTodaysOrdersAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the list of todays orders', async () => {
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
    applicationContext
      .getUseCases()
      .getTodaysOrdersInteractor.mockReturnValue(mockTodaysOrders);

    const result = await runAction(getTodaysOrdersAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.todaysOrders).toMatchObject(mockTodaysOrders);
  });
});
