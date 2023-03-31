import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setNegativeValueConfirmationTextAction } from './setNegativeValueConfirmationTextAction';

describe('setNegativeValueConfirmationTextAction', () => {
  const mockConfirmation =
    applicationContext.getConstants().NEGATIVE_VALUE_CONFIRMATION_TEXT;
  presenter.providers.applicationContext = applicationContext;

  it('sets the state.confirmationText', async () => {
    const mockPropsKey = 'something';
    const { state } = await runAction(setNegativeValueConfirmationTextAction, {
      modules: { presenter },
      props: {
        key: mockPropsKey,
      },
      state: {},
    });
    expect(state.confirmationText[mockPropsKey]).toEqual(mockConfirmation);
  });
});
