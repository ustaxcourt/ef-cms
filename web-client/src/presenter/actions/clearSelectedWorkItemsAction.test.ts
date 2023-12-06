import { clearSelectedWorkItemsAction } from './clearSelectedWorkItemsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearSelectedWorkItemsAction', () => {
  it('should set the value of state.selectedWorkItems to an empty list', async () => {
    const result = await runAction(clearSelectedWorkItemsAction, {
      state: {
        selectedWorkItems: [{}, {}, {}],
      },
    });

    expect(result.state.selectedWorkItems).toEqual([]);
  });
});
