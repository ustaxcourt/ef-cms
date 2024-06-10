import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetRepresentAPartyWizardStepAction } from './unsetRepresentAPartyWizardStepAction';

describe('unsetRepresentAPartyWizardStepAction', () => {
  it('should clear wizardStep from state', async () => {
    const { state } = await runAction(unsetRepresentAPartyWizardStepAction, {
      state: {
        wizardStep: 'TestWizardStep',
      },
    });

    expect(state.wizardStep).toBeUndefined();
  });
});
