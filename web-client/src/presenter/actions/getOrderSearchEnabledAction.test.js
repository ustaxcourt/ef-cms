import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getOrderSearchEnabledAction } from './getOrderSearchEnabledAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getOrderSearchEnabledAction', () => {
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

  it('should set state.isOrderSearchEnabled to the value returned from the interactor', async () => {
    applicationContext
      .getUseCases()
      .getOrderSearchEnabledInteractor.mockResolvedValue(true);

    const result = await runAction(getOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.isOrderSearchEnabled).toEqual(true);
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getOrderSearchEnabledInteractor.mockResolvedValue(true);

    await runAction(getOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning if the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getOrderSearchEnabledInteractor.mockResolvedValue(false);

    await runAction(getOrderSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });
});
