import { getAssignWorkItemsAlertSuccessAction } from './getAssignWorkItemsAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getAssignWorkItemsAlertSuccessAction', () => {
  it('should return a success message', async () => {
    const { output } = await runAction(getAssignWorkItemsAlertSuccessAction);

    expect(output.alertSuccess.message).toBe('Selected documents assigned.');
  });
});
