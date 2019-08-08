import { navigateToStartCaseWizardNextStepAction } from './navigateToStartCaseWizardNextStepAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const routeStub = sinon.stub();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToStartCaseWizardNextStepAction', () => {
  it("should set the state.wizardStep to the props.nextStep passed in, and route to the next step's view", async () => {
    const result = await runAction(navigateToStartCaseWizardNextStepAction, {
      modules: {
        presenter,
      },
      props: {
        nextStep: '2',
      },
    });

    expect(result.state.wizardStep).toEqual('StartCaseStep2');
    expect(routeStub.calledOnce).toEqual(true);
    expect(routeStub.getCall(0).args[0]).toEqual('/file-a-petition/step-2');
  });
});
