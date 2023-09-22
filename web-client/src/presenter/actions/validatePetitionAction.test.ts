import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePetitionAction } from './validatePetitionAction';

describe('validatePetitionAction', () => {
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

    applicationContext
      .getUseCases()
      .validatePetitionInteractor.mockReturnValue(null);
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validatePetitionAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePetitionInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when errors are found', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionInteractor.mockReturnValue('validation errors');

    await runAction(validatePetitionAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePetitionInteractor,
    ).toHaveBeenCalled();
  });
});
