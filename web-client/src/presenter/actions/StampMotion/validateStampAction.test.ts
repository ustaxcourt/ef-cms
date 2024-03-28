import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateStampAction } from './validateStampAction';

describe('validateStampAction', () => {
  let successMock;
  let errorMock;
  const { MOTION_DISPOSITIONS } = applicationContext.getConstants();

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the success path when the form is valid', async () => {
    applicationContext
      .getUseCases()
      .validateStampInteractor.mockReturnValue(null);

    await runAction(validateStampAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('should call the error path with an error message when form is invalid', async () => {
    applicationContext.getUseCases().validateStampInteractor.mockReturnValue({
      disposition: 'Enter a disposition',
    });

    await runAction(validateStampAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorMock.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: { disposition: 'Enter a disposition' },
    });
  });
});
