import { runAction } from 'cerebral/test';
import { setDocumentIdAction } from './setDocumentIdAction';

describe('setDocumentIdAction', () => {
  it('sets state.documentId from props', async () => {
    const { state } = await runAction(setDocumentIdAction, {
      props: {
        documentId: '1234',
      },
    });

    expect(state.documentId).toEqual('1234');
  });
});
