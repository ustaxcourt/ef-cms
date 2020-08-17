import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultServiceIndicatorAction } from './setDefaultServiceIndicatorAction';

describe('setDefaultServiceIndicatorAction', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the default serviceIndicator for the key', async () => {
    const { state } = await runAction(
      setDefaultServiceIndicatorAction('testKey'),
      {
        modules: {
          presenter,
        },
        state: {
          testKey: null, // the key that will be set
        },
      },
    );

    expect(state['testKey'].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
