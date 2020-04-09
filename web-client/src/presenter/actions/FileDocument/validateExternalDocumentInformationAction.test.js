import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateExternalDocumentInformationAction } from './validateExternalDocumentInformationAction';

describe('validateExternalDocumentInformationAction', () => {
  let validateExternalDocumentInformationStub;
  let successStub;
  let errorStub;

  let mockDocInfo;

  beforeEach(() => {
    validateExternalDocumentInformationStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocInfo = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateExternalDocumentInformationInteractor: validateExternalDocumentInformationStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateExternalDocumentInformationStub = jest.fn().mockReturnValue(null);
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateExternalDocumentInformationStub = jest
      .fn()
      .mockReturnValue('error');
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
