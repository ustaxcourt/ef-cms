import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultSealDocketEntryModalStateAction } from './setDefaultSealDocketEntryModalStateAction';

describe('setDefaultSealDocketEntryModalStateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the state.modal.docketEntrySealedTo to the value of "Public"', async () => {
    const DOCKET_ENTRY_ID = 'abc';
    const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

    const { state } = await runAction(
      setDefaultSealDocketEntryModalStateAction,
      {
        modal: {
          docketEntrySealedTo: 'This is private!!!!!',
        },
        modules: {
          presenter,
        },
        props: {
          docketEntryId: DOCKET_ENTRY_ID,
        },
        state: {},
      },
    );

    expect(state.modal.docketEntrySealedTo).toEqual(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );

    expect(state.modal.docketEntryId).toEqual(DOCKET_ENTRY_ID);
  });
});
