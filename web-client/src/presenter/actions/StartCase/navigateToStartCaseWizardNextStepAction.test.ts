import { navigateToStartCaseWizardNextStepAction } from './navigateToStartCaseWizardNextStepAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeStub = jest.fn();

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
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual('/file-a-petition/step-2');
  });
});
