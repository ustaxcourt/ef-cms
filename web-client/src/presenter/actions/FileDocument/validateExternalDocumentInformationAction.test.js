import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateExternalDocumentInformationAction } from './validateExternalDocumentInformationAction';

describe('validateExternalDocumentInformationAction', () => {
  const { validateExternalDocumentInformationInteractor } =
    applicationContext.getUseCases();

  let successStub;
  let errorStub;

  let mockDocInfo;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocInfo = {
      data: 'hello world',
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateExternalDocumentInformationInteractor.mockReturnValue(null);
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
    validateExternalDocumentInformationInteractor.mockReturnValue('error');
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
