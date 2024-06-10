import { runAction } from '@web-client/presenter/test.cerebral';
import { setRepresentAPartyWizardStepActionGenerator } from './setRepresentAPartyWizardStepActionGenerator';

describe('setRepresentAPartyWizardStepActionGenerator', () => {
  it('should set state.wizardStep to the value passed in', async () => {
    const mockWizardStep = 'TestWizardStep';

    const { state } = await runAction(
      setRepresentAPartyWizardStepActionGenerator(mockWizardStep),
    );

    expect(state.wizardStep).toBe(mockWizardStep);
  });
});
