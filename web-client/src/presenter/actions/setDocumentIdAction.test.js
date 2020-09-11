import { runAction } from 'cerebral/test';
import { setDocumentIdAction } from './setDocumentIdAction';

describe('setDocumentIdAction', () => {
  it('sets state.docketEntryId from props', async () => {
    const { state } = await runAction(setDocumentIdAction, {
      props: {
        docketEntryId: '1234',
      },
    });

    expect(state.docketEntryId).toEqual('1234');
  });
});
