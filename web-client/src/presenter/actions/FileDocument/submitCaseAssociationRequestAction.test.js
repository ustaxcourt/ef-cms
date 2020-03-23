import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';

describe('submitCaseAssociationRequestAction', () => {
  let submitCaseAssociationRequestStub;
  let submitPendingCaseAssociationRequestStub;

  beforeEach(() => {
    submitCaseAssociationRequestStub = jest.fn();
    submitPendingCaseAssociationRequestStub = jest.fn();

    presenter.providers.applicationContext = {
      getCurrentUser: () => ({
        email: 'practitioner1@example.com',
      }),
      getUseCases: () => ({
        submitCaseAssociationRequestInteractor: submitCaseAssociationRequestStub,
        submitPendingCaseAssociationRequestInteractor: submitPendingCaseAssociationRequestStub,
      }),
    };
  });

  it('should call submitCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Entry of Appearance',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestStub.mock.calls.length).toEqual(1);
  });

  it('should call submitPendingCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitPendingCaseAssociationRequestStub.mock.calls.length).toEqual(
      1,
    );
  });
});
