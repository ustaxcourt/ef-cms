import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getInternalOrderSearchEnabledAction } from './getInternalOrderSearchEnabledAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getInternalOrderSearchEnabledAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set state.isInternalOrderSearchEnabled to the value returned from the interactor', async () => {
    applicationContext
      .getUseCases()
      .getInternalOrderSearchEnabledInteractor.mockResolvedValue(true);

    const result = await runAction(getInternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.isInternalOrderSearchEnabled).toEqual(true);
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getInternalOrderSearchEnabledInteractor.mockResolvedValue(true);

    await runAction(getInternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning if the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getInternalOrderSearchEnabledInteractor.mockResolvedValue(false);

    await runAction(getInternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });
});
