import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';
import sinon from 'sinon';

describe('submitCaseAssociationRequestAction', () => {
  let submitCaseAssociationRequestStub;
  let submitPendingCaseAssociationRequestStub;
  let addCoversheetInteractorStub;
  let fileDocketEntryStub;

  beforeEach(() => {
    submitCaseAssociationRequestStub = sinon.stub();
    submitPendingCaseAssociationRequestStub = sinon.stub();
    addCoversheetInteractorStub = sinon.stub();
    fileDocketEntryStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorStub,
        fileDocketEntryInteractor: fileDocketEntryStub,
        submitCaseAssociationRequestInteractor: submitCaseAssociationRequestStub,
        submitPendingCaseAssociationRequestInteractor: submitPendingCaseAssociationRequestStub,
      }),
    };
  });

  it('should call submitCaseAssociationRequest', async () => {
    fileDocketEntryStub.returns({ documents: [] });
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Entry of appearance',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestStub.calledOnce).toEqual(true);
  });

  it('should call submitPendingCaseAssociationRequest', async () => {
    fileDocketEntryStub.returns({ documents: [] });
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

    expect(submitPendingCaseAssociationRequestStub.calledOnce).toEqual(true);
  });
});
