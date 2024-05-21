import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTodaysDateAction } from './setTodaysDateAction';

describe('setTodaysDateAction', () => {
  const mockDate = '2088-01-01';

  beforeAll(() => {
    applicationContext.getUtilities().formatNow.mockReturnValue(mockDate);
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the todaysDate property', async () => {
    const result = await runAction(setTodaysDateAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state).toHaveProperty('todaysDate', mockDate);
  });
});
