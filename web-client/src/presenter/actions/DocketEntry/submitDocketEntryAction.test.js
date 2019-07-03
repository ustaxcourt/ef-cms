import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';
import sinon from 'sinon';

describe('submitDocketEntryAction', () => {
  let createCoverSheetStub;
  let fileExternalDocumentStub;

  beforeEach(() => {
    createCoverSheetStub = sinon.stub();
    fileExternalDocumentStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCoverSheet: createCoverSheetStub,
        fileExternalDocumentInteractor: fileExternalDocumentStub,
      }),
    };
  });

  it('should call fileExternalDocument', async () => {
    fileExternalDocumentStub.returns({ documents: [] });
    await runAction(submitDocketEntryAction, {
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

    expect(fileExternalDocumentStub.calledOnce).toEqual(true);
  });
});
