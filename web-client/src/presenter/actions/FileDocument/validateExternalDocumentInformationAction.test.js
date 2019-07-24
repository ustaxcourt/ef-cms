import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateExternalDocumentInformationAction } from './validateExternalDocumentInformationAction';
import sinon from 'sinon';

describe('validateExternalDocumentInformationAction', () => {
  let validateExternalDocumentInformationStub;
  let successStub;
  let errorStub;

  let mockDocInfo;

  beforeEach(() => {
    validateExternalDocumentInformationStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

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

  it('should call the path success when no errors are found', async () => {
    validateExternalDocumentInformationStub.returns(null);
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateExternalDocumentInformationStub.returns('error');
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
