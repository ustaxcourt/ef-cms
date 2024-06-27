import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCaseAssociationRequestWizardStepAction } from './unsetCaseAssociationRequestWizardStepAction';

describe('unsetCaseAssociationRequestWizardStepAction', () => {
  it('should clear wizardStep from state', async () => {
    const { state } = await runAction(
      unsetCaseAssociationRequestWizardStepAction,
      {
        state: {
          wizardStep: 'TestWizardStep',
        },
      },
    );

    expect(state.wizardStep).toBeUndefined();
  });
});
