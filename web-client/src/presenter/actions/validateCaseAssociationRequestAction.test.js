import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseAssociationRequestAction } from './validateCaseAssociationRequestAction';

describe('validateCaseAssociationRequest', () => {
  let validateCaseAssociationRequestStub;
  let successStub;
  let errorStub;

  let mockCaseAssociationRequest;

  beforeEach(() => {
    validateCaseAssociationRequestStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

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

  it('should call the success path when no errors are found', async () => {
    validateCaseAssociationRequestStub = jest.fn().mockReturnValue(null);
    await runAction(validateCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseAssociationRequest,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateCaseAssociationRequestStub = jest.fn().mockReturnValue('error');
    await runAction(validateCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseAssociationRequest,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
