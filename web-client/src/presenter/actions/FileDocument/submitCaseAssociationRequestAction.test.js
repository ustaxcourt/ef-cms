import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';
import sinon from 'sinon';

describe('submitCaseAssociationRequestAction', () => {
  let submitCaseAssociationRequestStub;
  let createCoverSheetStub;
  let fileExternalDocumentStub;

  beforeEach(() => {
    submitCaseAssociationRequestStub = sinon.stub();
    createCoverSheetStub = sinon.stub();
    fileExternalDocumentStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCoverSheet: createCoverSheetStub,
        fileExternalDocument: fileExternalDocumentStub,
        submitCaseAssociationRequest: submitCaseAssociationRequestStub,
      }),
    };
  });

  it('should call submitCaseAssociationRequest', async () => {
    fileExternalDocumentStub.returns({ documents: [] });
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
