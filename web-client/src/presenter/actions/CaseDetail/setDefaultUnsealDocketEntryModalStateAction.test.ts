import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultUnsealDocketEntryModalStateAction } from './setDefaultUnsealDocketEntryModalStateAction';

describe('setDefaultUnsealDocketEntryModalStateAction', () => {
  const DOCKET_ENTRY_ID = '123';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.modal.docketEntryId to match props', async () => {
    const { state } = await runAction(
      setDefaultUnsealDocketEntryModalStateAction,
      {
        modal: {},
        modules: {
          presenter,
        },
        props: {
          docketEntryId: DOCKET_ENTRY_ID,
        },
        state: {},
      },
    );

    expect(state.modal.docketEntryId).toEqual(DOCKET_ENTRY_ID);
  });
});
