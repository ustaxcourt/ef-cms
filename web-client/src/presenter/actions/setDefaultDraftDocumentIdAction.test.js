import { runAction } from 'cerebral/test';
import { setDefaultDraftDocumentIdAction } from './setDefaultDraftDocumentIdAction';

describe('setDefaultDraftDocumentIdAction', () => {
  it('sets state.screenMetadata.draftDocumentId from props', async () => {
    const { state } = await runAction(setDefaultDraftDocumentIdAction, {
      props: {
        draftDocumentId: '1234',
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(state.screenMetadata.draftDocumentId).toEqual('1234');
  });
});
