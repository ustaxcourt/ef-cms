import { runAction } from 'cerebral/test';
import { setWizardStepOnFormAction } from './setWizardStepOnFormAction';

describe('setWizardStepOnFormAction', () => {
  it('sets the state.form.wizardStep to the props.nextStep - 1', async () => {
    const result = await runAction(setWizardStepOnFormAction, {
      props: {
        nextStep: '2',
      },
      state: {
        form: {},
      },
    });
    expect(result.state.form.wizardStep).toEqual('1');
  });
});
