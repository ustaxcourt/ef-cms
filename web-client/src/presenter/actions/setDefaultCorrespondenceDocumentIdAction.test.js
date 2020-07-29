import { runAction } from 'cerebral/test';
import { setDefaultCorrespondenceDocumentIdAction } from './setDefaultCorrespondenceDocumentIdAction';

describe('setDefaultCorrespondenceDocumentIdAction', () => {
  it('sets state.screenMetadata.draftDocumentId from props', async () => {
    const { state } = await runAction(
      setDefaultCorrespondenceDocumentIdAction,
      {
        props: {
          correspondenceDocumentId: '1234',
        },
        state: {
          screenMetadata: {},
        },
      },
    );

    expect(state.screenMetadata.correspondenceDocumentId).toEqual('1234');
  });
});
