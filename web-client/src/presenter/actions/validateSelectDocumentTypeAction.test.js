import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateSelectDocumentTypeAction } from './validateSelectDocumentTypeAction';

const errorMock = jest.fn();
const successMock = jest.fn();

describe('validateSelectDocumentTypeAction', () => {
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
