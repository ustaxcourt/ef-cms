import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';
import sinon from 'sinon';

describe('submitCourtIssuedOrderAction', () => {
  let fileExternalDocumentStub;

  beforeEach(() => {
    fileExternalDocumentStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        fileExternalDocument: fileExternalDocumentStub,
        sanitizePdf: () => {},
        validatePdf: () => {},
        virusScanPdf: () => {},
      }),
    };
  });

  it('should skip calling fileExternalDocument if there is no primaryDocumentFileId', async () => {
    fileExternalDocumentStub.returns({ documents: [] });
    await runAction(submitCourtIssuedOrderAction, {
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

    expect(fileExternalDocumentStub.calledOnce).toEqual(false);
  });

  it('should call fileExternalDocument', async () => {
    fileExternalDocumentStub.returns({ documents: [] });
    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'abc',
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(fileExternalDocumentStub.calledOnce).toEqual(true);
  });
});
