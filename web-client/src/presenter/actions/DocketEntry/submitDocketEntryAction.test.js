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
        fileExternalDocument: fileExternalDocumentStub,
      }),
    };
  });

  it('should call fileExternalDocument', async () => {
    fileExternalDocumentStub.returns({ documents: [] });
    const result = await runAction(submitDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'Forward',
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
        screenMetadata: {
          filedDocumentIds: [],
        },
      },
    });

    expect(fileExternalDocumentStub.calledOnce).toEqual(true);
    expect(result.state.screenMetadata.filedDocumentIds).toEqual(['Forward']);
  });
});
