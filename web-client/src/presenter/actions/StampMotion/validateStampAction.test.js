import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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
      form: {
        status: MOTION_DISPOSITIONS.GRANTED,
      },
      modules: {
        presenter,
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('should call the error path with an error message when form is invalid', async () => {
    applicationContext.getUseCases().validateStampInteractor.mockReturnValue({
      status: 'Enter a status',
    });

    await runAction(validateStampAction, {
      form: {},
      modules: {
        presenter,
      },
    });

    expect(errorMock.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: { status: 'Enter a status' },
    });
  });
});
