import { fileExternalDocumentAction } from './fileExternalDocumentAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('fileExternalDocumentAction', () => {
  let uploadExternalDocumentStub;
  let addCoversheetStub;
  let submitCaseAssociationRequestStub;

  let successMock;

  beforeEach(() => {
    uploadExternalDocumentStub = sinon.stub();
    addCoversheetStub = sinon.stub();
    submitCaseAssociationRequestStub = sinon.stub();

    successMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetStub,
        submitCaseAssociationRequestInteractor: submitCaseAssociationRequestStub,
        uploadExternalDocumentInteractor: uploadExternalDocumentStub,
      }),
    };

    presenter.providers.path = {
      error: () => null,
      success: args => {
        successMock();
        return args;
      },
    };
  });

  it('should call uploadExternalDocument', async () => {
    uploadExternalDocumentStub.returns({ documents: [] });
    await runAction(fileExternalDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
          primaryDocumentFile: {},
        },
      },
    });

    expect(uploadExternalDocumentStub.calledOnce).toEqual(true);
  });

  it('should call submitCaseAssociationRequest when the user is a respondent', async () => {
    uploadExternalDocumentStub.returns({ documents: [] });
    await runAction(fileExternalDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
          primaryDocumentFile: {},
        },
        user: {
          role: 'respondent',
        },
      },
    });

    expect(uploadExternalDocumentStub.calledOnce).toEqual(true);
    expect(submitCaseAssociationRequestStub.calledOnce).toEqual(true);
  });

  it('should return the success path with caseDetail, caseId, and documentsFiled', async () => {
    uploadExternalDocumentStub.returns({ documents: [] });
    const result = await runAction(fileExternalDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
          primaryDocumentFile: {},
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
    expect(result.output).toHaveProperty('caseDetail');
    expect(result.output).toHaveProperty('caseId');
    expect(result.output).toHaveProperty('documentsFiled');
  });
});
