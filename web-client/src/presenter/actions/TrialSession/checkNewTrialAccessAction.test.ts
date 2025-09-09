import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '@web-client/presenter/presenter-mock';
import { checkNewTrialAccessAction } from './checkNewTrialAccessAction';
import {
  colvinsChambersUser,
  judgeUser,
  petitionsClerkUser,
} from '@shared/test/mockUsers';

describe('batchDownloadDocketEntriesAction', () => {
  const pathYesAccessStub = jest.fn();
  const pathNoAccessStub = jest.fn();

  presenter.providers.path = {
    noAccess: pathNoAccessStub,
    yesAccess: pathYesAccessStub,
  };

  it('should should invoke path.noAccess when user is judge and trial session status is new', async () => {
    await runAction(checkNewTrialAccessAction, {
      modules: {
        presenter,
      },
      state: {
        user: judgeUser,
      },
      props: {
        trialSession: {
          sessionStatus: SESSION_STATUS_TYPES.new,
        },
      },
    });

    expect(pathNoAccessStub).toHaveBeenCalled();
    expect(pathYesAccessStub).not.toHaveBeenCalled();
  });

  it('should should invoke path.noAccess when user is chambers and trial session status is new', async () => {
    await runAction(checkNewTrialAccessAction, {
      modules: {
        presenter,
      },
      state: {
        user: colvinsChambersUser,
      },
      props: {
        trialSession: {
          sessionStatus: SESSION_STATUS_TYPES.new,
        },
      },
    });

    expect(pathNoAccessStub).toHaveBeenCalled();
    expect(pathYesAccessStub).not.toHaveBeenCalled();
  });

  it('should should invoke path.yesAccess when user is neither chambers nor judge and trial session status is new', async () => {
    await runAction(checkNewTrialAccessAction, {
      modules: {
        presenter,
      },
      state: {
        user: petitionsClerkUser,
      },
      props: {
        trialSession: {
          sessionStatus: SESSION_STATUS_TYPES.new,
        },
      },
    });

    expect(pathNoAccessStub).not.toHaveBeenCalled();
    expect(pathYesAccessStub).toHaveBeenCalled();
  });

  it('should should invoke path.yesAccess when user is a judge and trial session status is not new', async () => {
    await runAction(checkNewTrialAccessAction, {
      modules: {
        presenter,
      },
      state: {
        user: judgeUser,
      },
      props: {
        trialSession: {
          sessionStatus: SESSION_STATUS_TYPES.open,
        },
      },
    });

    expect(pathNoAccessStub).not.toHaveBeenCalled();
    expect(pathYesAccessStub).toHaveBeenCalled();
  });
});
