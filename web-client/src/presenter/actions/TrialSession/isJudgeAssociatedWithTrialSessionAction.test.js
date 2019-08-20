import { isJudgeAssociatedWithTrialSessionAction } from './isJudgeAssociatedWithTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('isJudgeAssociatedWithTrialSessionAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return path.yes() if the judge is associated with the trial session', async () => {
    await runAction(isJudgeAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { userId: '123' },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() if the judge is not associated with the trial session', async () => {
    await runAction(isJudgeAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { userId: '234' },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
