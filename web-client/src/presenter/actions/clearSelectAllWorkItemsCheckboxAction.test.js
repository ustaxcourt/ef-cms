import { clearSelectAllWorkItemsCheckboxAction } from './clearSelectAllWorkItemsCheckboxAction';
import { runAction } from 'cerebral/test';

describe('clearSelectAllWorkItemsCheckboxAction', () => {
  it('should clear the state.workitemAllCheckbox', async () => {
    const result = await runAction(clearSelectAllWorkItemsCheckboxAction, {
      state: {
        workitemAllCheckbox: true,
      },
    });

    expect(result.state.workitemAllCheckbox).toBe(false);
  });
});
