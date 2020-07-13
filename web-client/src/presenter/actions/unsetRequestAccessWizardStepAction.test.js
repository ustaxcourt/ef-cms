import { runAction } from 'cerebral/test';
import { unsetRequestAccessWizardStepAction } from './unsetRequestAccessWizardStepAction';

describe('unsetRequestAccessWizardStepAction', () => {
  it('should clear wizardStep from state', async () => {
    const { state } = await runAction(unsetRequestAccessWizardStepAction, {
      state: {
        wizardStep: 'TestWizardStep',
      },
    });

    expect(state.wizardStep).toBeUndefined();
  });
});
