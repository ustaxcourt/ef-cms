import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateAddPractitionerDocumentFormAction } from './validateAddPractitionerDocumentFormAction';

describe('validateAddPractitionerDocumentFormAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('returns the success path when the use case returns no errors', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerDocumentFormInteractor.mockReturnValue(null);

    runAction(validateAddPractitionerDocumentFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: 'Application',
          categoryType: 'Application',
          description: 'Test',
          practitionerDocumentFile: { name: 'test.pdf' },
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path when the use case returns errors with missing categoryName', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerDocumentFormInteractor.mockReturnValue({
        categoryName: 'Enter a category name',
      });

    runAction(validateAddPractitionerDocumentFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: undefined,
          categoryType: 'Application',
          description: 'Test',
          practitionerDocumentFile: { name: 'test.pdf' },
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('returns the error path when the use case returns errors with missing practitionerDocumentFile', () => {
    applicationContext
      .getUseCases()
      .validateAddPractitionerDocumentFormInteractor.mockReturnValue({
        fileName: 'Please provide a file',
      });

    runAction(validateAddPractitionerDocumentFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: 'Application',
          categoryType: 'Application',
          description: 'Test',
          practitionerDocumentFile: undefined,
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
