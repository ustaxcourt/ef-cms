import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';
import sinon from 'sinon';

describe('submitCourtIssuedOrderAction', () => {
  let fileCourtIssuedOrderStub;

  beforeEach(() => {
    fileCourtIssuedOrderStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        fileCourtIssuedOrderInteractor: fileCourtIssuedOrderStub,
        sanitizePdfInteractor: () => {},
        validatePdfInteractor: () => {},
        virusScanPdfInteractor: () => {},
      }),
    };
  });

  it('should skip calling fileCourtIssuedOrder if there is no primaryDocumentFileId', async () => {
    fileCourtIssuedOrderStub.returns({ documents: [] });
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

    expect(fileCourtIssuedOrderStub.calledOnce).toEqual(false);
  });

  it('should call fileCourtIssuedOrder', async () => {
    fileCourtIssuedOrderStub.returns({ documents: [] });
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

    expect(fileCourtIssuedOrderStub.calledOnce).toEqual(true);
  });
});
