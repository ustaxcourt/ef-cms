import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { shouldGetTrialSessionWorkingCopyAction } from './shouldGetTrialSessionWorkingCopyAction';

describe('shouldGetTrialSessionWorkingCopyAction', () => {
  let yesStub;
  let noStub;

  beforeEach(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should select yes when trial session exists', async () => {
    await runAction(shouldGetTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          trialSessionId: '123',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no path when no trial session exists', async () => {
    await runAction(shouldGetTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
