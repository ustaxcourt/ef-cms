import { runAction } from 'cerebral/test';
import { setDefaultDraftDocumentIdAction } from './setDefaultDraftDocumentIdAction';

describe('setDefaultDraftDocumentIdAction', () => {
  it('sets state.screenMetadata.draftDocketEntryId from props', async () => {
    const { state } = await runAction(setDefaultDraftDocumentIdAction, {
      props: {
        docketEntryId: '1234',
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(state.screenMetadata.draftDocketEntryId).toEqual('1234');
  });
});
