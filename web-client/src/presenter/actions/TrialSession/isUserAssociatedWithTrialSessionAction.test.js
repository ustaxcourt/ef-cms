import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../applicationContext';
import { isUserAssociatedWithTrialSessionAction } from './isUserAssociatedWithTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('isUserAssociatedWithTrialSessionAction', () => {
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
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { role: User.ROLES.judge, userId: '123' },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() if the judge is not associated with the trial session', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { role: User.ROLES.judge, userId: '234' },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return path.no() if the user is in the chambers section and their judge is not associated with the trial session', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { role: User.ROLES.chambers, userId: '234' },
        users: [{ role: User.ROLES.judge, userId: '456' }],
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return path.yes() if the user is in the chambers section and their judge is associated with the trial session', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          judge: { userId: '123' },
        },
        user: { role: User.ROLES.chambers, userId: '234' },
        users: [{ role: User.ROLES.judge, userId: '123' }],
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
