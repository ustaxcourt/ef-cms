import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCreateTermModalAction } from './validateCreateTermModalAction';

describe('validateCreateTermModalAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateCreateTermModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          termEndDate: '03/31/2050',
          termName: 'test term',
          termStartDate: '01/01/2050',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue({ some: 'error' });
    await runAction(validateCreateTermModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
