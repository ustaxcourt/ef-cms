import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetNegativeValueConfirmationTextAction } from './unsetNegativeValueConfirmationTextAction';

describe('unsetNegativeValueConfirmationTextAction', () => {
  const mockConfirmation =
    applicationContext.getConstants().NEGATIVE_VALUE_CONFIRMATION_TEXT;
  presenter.providers.applicationContext = applicationContext;

  it('sets the state.confirmationText', async () => {
    const mockPropsKey = 'something';
    const { state } = await runAction(
      unsetNegativeValueConfirmationTextAction,
      {
        modules: { presenter },
        props: {
          key: mockPropsKey,
        },
        state: {
          confirmationText: { mockPropsKey: mockConfirmation },
        },
      },
    );
    expect(state.confirmationText[mockPropsKey]).toBeUndefined();
  });
});
