import { runAction } from '@web-client/presenter/test.cerebral';
import { toggleSelectAllWorkItemsAction } from './toggleSelectAllWorkItemsAction';

describe('toggleSelectAllWorkItemsAction', () => {
  it('should set the selectedWorkItems equal to the current formattedWorkItems when enabling the checkbox', async () => {
    const results = await runAction(toggleSelectAllWorkItemsAction, {
      state: {
        formattedWorkQueue: [{ workItemId: 'abc' }],
        workitemAllCheckbox: false,
      },
    });

    expect(results.state.workitemAllCheckbox).toBe(true);
    expect(results.state.selectedWorkItems).toEqual([{ workItemId: 'abc' }]);
  });

  it('should clear the selectedWorkItems when workitemAllCheckbox is true', async () => {
    const results = await runAction(toggleSelectAllWorkItemsAction, {
      state: {
        selectedWorkItems: [{ workItemId: 'abc' }],
        workitemAllCheckbox: true,
      },
    });

    expect(results.state.workitemAllCheckbox).toBe(false);
    expect(results.state.selectedWorkItems).toEqual([]);
  });
});
