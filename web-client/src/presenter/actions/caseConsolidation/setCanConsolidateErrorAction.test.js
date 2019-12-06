import { runAction } from 'cerebral/test';
import { setCanConsolidateErrorAction } from './setCanConsolidateErrorAction';

describe('setCanConsolidateErrorAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(setCanConsolidateErrorAction, {
      props: { error: 'mine eyes' },
    });
    expect(result.state.modal.error).toEqual('mine eyes');
  });
});
