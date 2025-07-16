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
      .validateExternalDocumentInteractor.mockReturnValue({
        some: "error"
      });
    runAction(validateSelectDocumentTypeAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(errorMock).toHaveBeenCalled();
  });

    it('should not return the category validation error', () => {
    applicationContext
      .getUseCases()
      .validateExternalDocumentInteractor.mockReturnValue({
        category: "Select a category.",
        documentType: "Select a document type"
      });
    runAction(validateSelectDocumentTypeAction, {
      modules: {
        presenter,
      },
      state: { form: { contact: {} } },
    });
    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder: [
        'documentTitle',
        'documentType',
        'freeText',
        'freeText2',
        'previousDocument',
        'serviceDate',
        'trialLocation',
        'ordinalValue',
        'otherIteration',
      ],
      errors: {
        documentType: "Select a document type"
      }
    });
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
