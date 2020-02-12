import { runAction } from 'cerebral/test';
import { setAddConsolidatedCaseSuccessMessageAction } from './setAddConsolidatedCaseSuccessMessageAction';

describe('setAddConsolidatedCaseSuccessMessageAction', () => {
  it('should update the state from state', async () => {
    const result = await runAction(setAddConsolidatedCaseSuccessMessageAction);

    expect(result.output).toEqual({
      alertSuccess: {
        message:
          'You can view your updates to the consolidated cases below under Case Information',
        title: 'Your Changes Have Been Saved',
      },
    });
  });
});
