import { fileExternalDocumentAction } from './fileExternalDocumentAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('fileExternalDocumentAction', () => {
  let uploadExternalDocumentStub;

  beforeEach(() => {
    uploadExternalDocumentStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        uploadExternalDocument: uploadExternalDocumentStub,
      }),
    };
  });

  it('should call uploadExternalDocument', async () => {
    uploadExternalDocumentStub.returns({});
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
