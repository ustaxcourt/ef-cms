import { runAction } from 'cerebral/test';
import { setWizardStepAction } from './setWizardStepAction';

describe('setWizardStepAction', () => {
  it('should set the value of state.wizardStep', async () => {
    const { state } = await runAction(
      setWizardStepAction('SelectDocumentType'),
      {
        modules: {},
        state: {
          wizardStep: 'BAD',
        },
      },
    );

    expect(state.wizardStep).toBe('SelectDocumentType');
  });
});
