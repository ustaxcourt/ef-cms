import { checkDawsonHasUpdatedAction } from '@web-client/presenter/actions/checkDawsonHasUpdatedAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkDawsonHasUpdatedAction', () => {
  let pathUpdatedStub;
  let pathNotUpdatedStub;

  beforeEach(() => {
    pathUpdatedStub = jest.fn();
    pathNotUpdatedStub = jest.fn();

    presenter.providers.path = {
      dawsonHasNotUpdated: pathNotUpdatedStub,
      dawsonHasUpdated: pathUpdatedStub,
    };
  });

  it('properly handles the case when dawsonHasUpdated is false', async () => {
    await runAction(checkDawsonHasUpdatedAction, {
      modules: {
        presenter,
      },
      state: {
        dawsonHasUpdated: false,
      },
    });

    expect(pathNotUpdatedStub).toHaveBeenCalled();
  });

  it('properly handles the case when dawsonHasUpdated is true', async () => {
    await runAction(checkDawsonHasUpdatedAction, {
      modules: {
        presenter,
      },
      state: {
        dawsonHasUpdated: true,
      },
    });

    expect(pathUpdatedStub).toHaveBeenCalled();
  });
});
