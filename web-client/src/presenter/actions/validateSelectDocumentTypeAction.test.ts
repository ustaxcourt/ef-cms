import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateSelectDocumentTypeAction } from './validateSelectDocumentTypeAction';

describe('validateSelectDocumentTypeAction', () => {
  const errorMock = jest.fn();
  const successMock = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if document is invalid', () => {
    applicationContext
      .getUseCases()
      .validateExternalDocumentInteractor.mockReturnValue(
        'something went wrong',
      );
    runAction(validateSelectDocumentTypeAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the success path if document is valid', () => {
    applicationContext
      .getUseCases()
      .validateExternalDocumentInteractor.mockReturnValue(undefined);
    runAction(validateSelectDocumentTypeAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(successMock).toHaveBeenCalled();
  });
});
