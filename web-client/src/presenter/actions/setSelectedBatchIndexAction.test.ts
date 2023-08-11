import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedBatchIndexAction } from './setSelectedBatchIndexAction';

describe('setSelectedBatchIndexAction', () => {
  it('sets state.scanner.selectedBatchIndex to the passed in props.selectedBatchIndex', async () => {
    const result = await runAction(setSelectedBatchIndexAction, {
      props: {
        selectedBatchIndex: 3,
      },
    });
    expect(result.state.scanner.selectedBatchIndex).toEqual(3);
  });
});
