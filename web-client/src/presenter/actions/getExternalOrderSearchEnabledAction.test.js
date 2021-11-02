import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getExternalOrderSearchEnabledAction } from './getExternalOrderSearchEnabledAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getExternalOrderSearchEnabledAction', () => {
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

  it('should set state.isExternalOrderSearchEnabled to the value returned from the interactor', async () => {
    applicationContext
      .getUseCases()
      .getExternalOrderSearchEnabledInteractor.mockResolvedValue(true);

    const result = await runAction(getExternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.isExternalOrderSearchEnabled).toEqual(true);
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getExternalOrderSearchEnabledInteractor.mockResolvedValue(true);

    await runAction(getExternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning if the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getExternalOrderSearchEnabledInteractor.mockResolvedValue(false);

    await runAction(getExternalOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });
});
