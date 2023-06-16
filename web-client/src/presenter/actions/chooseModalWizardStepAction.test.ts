import { chooseModalWizardStepAction } from './chooseModalWizardStepAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseModalWizardStepAction', () => {
  it('should set state.modal.wizardStep to the passed in props.value', async () => {
    const result = await runAction(chooseModalWizardStepAction, {
      props: { value: 'step1' },
      state: { modal: {} },
    });

    expect(result.state.modal.wizardStep).toEqual('step1');
  });
});
