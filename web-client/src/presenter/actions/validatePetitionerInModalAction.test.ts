import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePetitionerInModalAction } from './validatePetitionerInModalAction';
import { presenter } from '../presenter-mock';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

describe('validatePetitionerInModalAction', () => {
  beforeAll(() => {
    presenter.providers.path = {
      error: jest.fn(),
      success: jest.fn(),
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the success path if validation passes', () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue({});
    runAction(validatePetitionerInModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            contact: 'test contact',
          },
        },
        caseDetail: {
          petitioners: ['test petitioner'],
        },
      },
    });
    expect(presenter.providers.path.success).toHaveBeenCalled();
    expect(presenter.providers.path.error).not.toHaveBeenCalled();
  });

  it('should call the error path if validation fails', () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue({
        testError: 'error',
      });
    runAction(validatePetitionerInModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            contact: 'test contact',
          },
        },
        caseDetail: {
          petitioners: ['test petitioner'],
        },
      },
    });
    expect(presenter.providers.path.error).toHaveBeenCalled();
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });
});
