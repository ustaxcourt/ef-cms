import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { uploadExternalDocumentsAction } from './uploadExternalDocumentsAction';
import sinon from 'sinon';

describe('uploadExternalDocumentsAction', () => {
  let uploadExternalDocumentStub;

  beforeEach(() => {
    uploadExternalDocumentStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        uploadExternalDocuments: uploadExternalDocumentStub,
      }),
    };
  });

  it('should call uploadExternalDocuments', async () => {
    uploadExternalDocumentStub.returns([]);
    await runAction(uploadExternalDocumentsAction, {
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

    expect(uploadExternalDocumentStub.calledOnce).toEqual(true);
  });
});
