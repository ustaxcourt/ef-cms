import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCaseAssociationWizardStepAction } from './unsetCaseAssociationWizardStepAction';

describe('unsetCaseAssociationWizardStepAction', () => {
  it('should clear wizardStep from state', async () => {
    const { state } = await runAction(unsetCaseAssociationWizardStepAction, {
      state: {
        wizardStep: 'TestWizardStep',
      },
    });

    expect(state.wizardStep).toBeUndefined();
  });
});
