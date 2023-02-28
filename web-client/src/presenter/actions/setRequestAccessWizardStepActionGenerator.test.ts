import { runAction } from 'cerebral/test';
import { setRequestAccessWizardStepActionGenerator } from './setRequestAccessWizardStepActionGenerator';

describe('setRequestAccessWizardStepActionGenerator', () => {
  it('should set state.wizardStep to the value passed in', async () => {
    const mockWizardStep = 'TestWizardStep';
    const { state } = await runAction(
      setRequestAccessWizardStepActionGenerator(mockWizardStep),
    );

    expect(state.wizardStep).toBe(mockWizardStep);
  });
});
