import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateSelectDocumentTypeAction } from './validateSelectDocumentTypeAction';

const errorMock = jest.fn();
const successMock = jest.fn();

describe('validateSelectDocumentTypeAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if document is invalid', async () => {
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

  it('should return the success path if document is valid', async () => {
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
