import { runAction } from '@web-client/presenter/test.cerebral';
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
