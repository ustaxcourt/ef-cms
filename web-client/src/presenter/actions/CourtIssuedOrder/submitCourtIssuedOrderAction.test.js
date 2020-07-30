import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';

describe('submitCourtIssuedOrderAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call fileCourtIssuedOrder', async () => {
    applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor.mockReturnValue({ documents: [] });

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

    expect(
      applicationContext.getUseCases().fileCourtIssuedOrderInteractor,
    ).toBeCalled();
    expect(applicationContext.getUseCases().validatePdfInteractor).toBeCalled();
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toBeCalled();
  });

  it('should set document draftState', async () => {
    applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor.mockReturnValue({ documents: [] });

    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'abc',
      },
      state: {
        caseDetail: {
          docketNumber: '111-20',
        },
        form: {
          documentIdToEdit: '1234',
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCourtIssuedOrderInteractor.mock
        .calls[0][0].documentMetadata.draftState,
    ).toEqual({
      docketNumber: '111-20',
      documentType: 'Notice of Intervention',
    });
  });
});
