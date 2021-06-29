import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateCaseAssociationRequestAction } from './validateCaseAssociationRequestAction';

describe('validateCaseAssociationRequest', () => {
  let successStub;
  let errorStub;
  let mockCaseAssociationRequest;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockCaseAssociationRequest = {
      certificateOfService: true,
      certificateOfServiceDate: '1987-08-06T07:53.009Z',
      documentTitle: 'Entry of Appearance',
      documentType: 'Entry of Appearance',
      eventCode: '123',
      filers: [],
      primaryDocumentFile: {},
      scenario: 'Standard',
    };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseAssociationRequestInteractor.mockReturnValue(null);

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
    applicationContext
      .getUseCases()
      .validateCaseAssociationRequestInteractor.mockReturnValue('error');

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
