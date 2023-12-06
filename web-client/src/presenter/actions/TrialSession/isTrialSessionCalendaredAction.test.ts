import { isTrialSessionCalendaredAction } from './isTrialSessionCalendaredAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isTrialSessionCalendaredAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return path.yes() if a trial session is calendared', async () => {
    await runAction(isTrialSessionCalendaredAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          isCalendared: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() if a trial session is NOT calendared', async () => {
    await runAction(isTrialSessionCalendaredAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          isCalendared: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
