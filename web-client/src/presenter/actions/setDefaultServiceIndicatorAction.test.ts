import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultServiceIndicatorAction } from './setDefaultServiceIndicatorAction';

describe('setDefaultServiceIndicatorAction', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the default serviceIndicator to the props.defaultServiceIndicator for the given key', async () => {
    const { state } = await runAction(
      setDefaultServiceIndicatorAction('testKey'),
      {
        modules: {
          presenter,
        },
        props: {
          defaultServiceIndicator: 'foo',
        },
        state: {
          testKey: null, // the key that will be set
        },
      },
    );

    expect(state['testKey'].serviceIndicator).toEqual('foo');
  });

  it('sets the default serviceIndicator to electronic for the given key if no props.defaultServiceIndicator is given', async () => {
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
