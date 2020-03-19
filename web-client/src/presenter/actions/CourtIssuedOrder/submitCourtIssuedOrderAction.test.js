import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';

describe('submitCourtIssuedOrderAction', () => {
  let fileCourtIssuedOrderStub;

  beforeEach(() => {
    fileCourtIssuedOrderStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        fileCourtIssuedOrderInteractor: fileCourtIssuedOrderStub,
        validatePdfInteractor: () => {},
        virusScanPdfInteractor: () => {},
      }),
    };
  });

  it('should call fileCourtIssuedOrder', async () => {
    fileCourtIssuedOrderStub = jest.fn().mockReturnValue({ documents: [] });
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

    expect(fileCourtIssuedOrderStub.mock.calls.length).toEqual(1);
  });
});
