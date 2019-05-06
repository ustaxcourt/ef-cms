import { fileExternalDocumentAction } from './fileExternalDocumentAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('fileExternalDocumentAction', () => {
  let uploadExternalDocumentStub;
  let createCoverSheetStub;

  beforeEach(() => {
    uploadExternalDocumentStub = sinon.stub();
    createCoverSheetStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCoverSheet: createCoverSheetStub,
        uploadExternalDocument: uploadExternalDocumentStub,
      }),
    };

    presenter.providers.path = {
      error: () => null,
      success: () => null,
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
});
