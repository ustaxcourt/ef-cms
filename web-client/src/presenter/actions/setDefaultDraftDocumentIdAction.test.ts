import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultDraftDocumentIdAction } from './setDefaultDraftDocumentIdAction';

describe('setDefaultDraftDocumentIdAction', () => {
  it('sets state.draftDocumentViewerDocketEntryId from props', async () => {
    const { state } = await runAction(setDefaultDraftDocumentIdAction, {
      props: {
        docketEntryId: '1234',
      },
      state: {},
    });

    expect(state.draftDocumentViewerDocketEntryId).toEqual('1234');
  });
});
