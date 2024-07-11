import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseAssociationRequestStepActionGenerator } from './setCaseAssociationRequestStepActionGenerator';

describe('setCaseAssociationRequestStepActionGenerator', () => {
  it('should set state.wizardStep to the value passed in', async () => {
    const mockWizardStep = 'TestWizardStep';

    const { state } = await runAction(
      setCaseAssociationRequestStepActionGenerator(mockWizardStep),
    );

    expect(state.wizardStep).toBe(mockWizardStep);
  });
});
