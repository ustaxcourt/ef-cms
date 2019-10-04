import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseAssociationRequestAction } from './validateCaseAssociationRequestAction';
import sinon from 'sinon';

describe('validateCaseAssociationRequest', () => {
  let validateCaseAssociationRequestStub;
  let successStub;
  let errorStub;

  let mockCaseAssociationRequest;

  beforeEach(() => {
    validateCaseAssociationRequestStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockCaseAssociationRequest = {
      certificateOfService: true,
      certificateOfServiceDate: '1212-12-12',
      documentTitle: 'Entry of Appearance',
      documentType: 'Entry of Appearance',
      eventCode: '123',
      partyPrimary: true,
      primaryDocumentFile: {},
      scenario: 'Standard',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseAssociationRequestInteractor: validateCaseAssociationRequestStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateCaseAssociationRequestStub.returns(null);
    await runAction(validateCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseAssociationRequest,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCaseAssociationRequestStub.returns('error');
    await runAction(validateCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseAssociationRequest,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
