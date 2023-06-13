import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketEntryIdAction } from './setDocketEntryIdAction';

describe('setDocketEntryIdAction', () => {
  it('sets state.docketEntryId from props', async () => {
    const { state } = await runAction(setDocketEntryIdAction, {
      props: {
        docketEntryId: '1234',
      },
    });

    expect(state.docketEntryId).toEqual('1234');
  });
});
