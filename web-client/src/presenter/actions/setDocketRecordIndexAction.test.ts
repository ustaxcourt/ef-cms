import { runAction } from 'cerebral/test';
import { setDocketRecordIndexAction } from './setDocketRecordIndexAction';

describe('setDocketRecordIndexAction', () => {
  it('sets state.docketRecordIndex from props', async () => {
    const index = 5;

    const { state } = await runAction(setDocketRecordIndexAction, {
      props: {
        docketRecordIndex: index,
      },
    });

    expect(state.docketRecordIndex).toEqual(index);
  });
});
