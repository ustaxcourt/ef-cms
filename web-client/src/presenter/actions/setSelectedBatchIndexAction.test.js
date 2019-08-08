import { runAction } from 'cerebral/test';
import { setSelectedBatchIndexAction } from './setSelectedBatchIndexAction';

describe('setSelectedBatchIndexAction', () => {
  it('sets state.selectedBatchIndex to the passed in props.selectedBatchIndex', async () => {
    const result = await runAction(setSelectedBatchIndexAction, {
      props: {
        selectedBatchIndex: 3,
      },
    });
    expect(result.state.selectedBatchIndex).toEqual(3);
  });
});
