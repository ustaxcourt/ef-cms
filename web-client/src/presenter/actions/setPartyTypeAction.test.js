import { runAction } from 'cerebral/test';
import { setPartyTypeAction } from './setPartyTypeAction';

describe('setPartyTypeAction', () => {
  it('sets state.form.partyType from props', async () => {
    const { state } = await runAction(setPartyTypeAction, {
      props: {
        value: 'Cafe Disco',
      },
    });

    expect(state.form.partyType).toEqual('Cafe Disco');
  });
});
