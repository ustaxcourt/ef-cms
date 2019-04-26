import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';
import sinon from 'sinon';

describe('submitCaseAssociationRequestAction', () => {
  let submitCaseAssociationRequestStub;
  let createCoverSheetStub;

  beforeEach(() => {
    submitCaseAssociationRequestStub = sinon.stub();
    createCoverSheetStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCoverSheet: createCoverSheetStub,
        submitCaseAssociationRequest: submitCaseAssociationRequestStub,
      }),
    };
  });

  it('should call submitCaseAssociationRequest', async () => {
    submitCaseAssociationRequestStub.returns({ documents: [] });
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestStub.calledOnce).toEqual(true);
  });
});
