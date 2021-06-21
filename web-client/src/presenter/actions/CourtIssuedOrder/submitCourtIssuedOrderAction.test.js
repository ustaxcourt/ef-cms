import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';

describe('submitCourtIssuedOrderAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor.mockReturnValue(MOCK_CASE);

    applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor.mockReturnValue(MOCK_CASE);
  });

  it('should call fileCourtIssuedOrder', async () => {
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

  it('should set document draftOrderState', async () => {
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
          docketEntryIdToEdit: '1234',
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCourtIssuedOrderInteractor.mock
        .calls[0][1].documentMetadata.draftOrderState,
    ).toEqual({
      docketNumber: '111-20',
      documentType: 'Notice of Intervention',
    });
  });

  it('should return the docketEntryId of the submitted court issued order', async () => {
    const { output } = await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: '4234312d-7294-47ae-9f1d-182df17546a1',
      },
      state: {
        caseDetail: {},
        form: {
          docketEntryId: '4234312d-7294-47ae-9f1d-182df17546a1',
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.docketEntryId).toBe('4234312d-7294-47ae-9f1d-182df17546a1');
  });
});
