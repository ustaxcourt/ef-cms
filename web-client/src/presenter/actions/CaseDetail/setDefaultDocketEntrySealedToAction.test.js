import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultDocketEntrySealedToAction } from './setDefaultDocketEntrySealedToAction';

describe('setDefaultDocketEntrySealedToAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the state.modal.docketEntrySealedTo to the value of "Public"', async () => {
    const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

    const { state } = await runAction(setDefaultDocketEntrySealedToAction, {
      modal: {
        docketEntrySealedTo: 'This is private!!!!!',
      },
      modules: {
        presenter,
      },
      state: {},
    });

    expect(state.modal.docketEntrySealedTo).toEqual(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
  });
});
