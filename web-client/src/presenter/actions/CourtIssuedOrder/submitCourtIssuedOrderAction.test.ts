import { ConsolidatedCasesWithCheckboxInfoType } from '@web-client/presenter/actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCourtIssuedOrderAction } from './submitCourtIssuedOrderAction';

describe('submitCourtIssuedOrderAction', () => {
  const mockDocketEntryId = '4234312d-7294-47ae-9f1d-182df17546a1';
  const mockDocumentStorageId = '4234312d-7294-47ae-9f1d-182df17546a1';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor.mockReturnValue(undefined);

    applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor.mockReturnValue(undefined);
  });

  it('should call validatePdfInteractor and fileCourtIssuedOrderInteractor', async () => {
    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
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
      applicationContext.getUseCases().validatePdfInteractor.mock.calls[0][1],
    ).toEqual(expect.objectContaining({ key: mockDocumentStorageId }));

    expect(
      applicationContext.getUseCases().fileCourtIssuedOrderInteractor.mock
        .calls[0][1].primaryDocumentFileId,
    ).toEqual(mockDocumentStorageId);
  });

  it('should call updateCourtIssuedOrderInteractor', async () => {
    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
          docketEntryIdToEdit: mockDocketEntryId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCourtIssuedOrderInteractor.mock
        .calls[0][1].docketEntryIdToEdit,
    ).toEqual(mockDocketEntryId);
  });

  it('should set document draftOrderState', async () => {
    const consolidatedCasesToMultiDocketOn: ConsolidatedCasesWithCheckboxInfoType[] =
      [
        {
          checkboxDisabled: true,
          checked: true,
          docketNumber: '101-20',
          docketNumberWithSuffix: '101-20',
          formattedPetitioners: 'Petitioner 1, Petitioner 2',
          leadDocketNumber: '101-20',
        },
        {
          checkboxDisabled: true,
          checked: false,
          docketNumber: '102-20',
          docketNumberWithSuffix: '102-20L',
          formattedPetitioners: 'Petitioner 3, Petitioner 4',
          leadDocketNumber: '101-20',
        },
      ];

    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
      },
      state: {
        caseDetail: {
          docketNumber: '111-20',
        },
        form: {
          docketEntryIdToEdit: mockDocketEntryId,
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCourtIssuedOrderInteractor.mock
        .calls[0][1].documentMetadata.draftOrderState,
    ).toEqual({
      addedDocketNumbers: ['101-20'],
      docketNumber: '111-20',
      documentType: 'Notice of Intervention',
    });
  });

  it('should return the docketEntryId as documentStorageId of the submitted court issued order', async () => {
    const { output } = await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
      },
      state: {
        caseDetail: {},
        form: {
          docketEntryId: mockDocketEntryId,
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.docketEntryId).toBe(mockDocumentStorageId);
  });

  it('persists additionalOrderTextArray with only substantive clauses', async () => {
    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
      },
      state: {
        caseDetail: { docketNumber: '111-20' },
        form: {
          documentType: 'Order',
          primaryDocumentFile: {},
          additionalOrderTextArray: ['', ' \t', 'Parties shall comply.'],
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedOrderInteractor.mock
        .calls[0][1].documentMetadata.additionalOrderTextArray,
    ).toEqual(['Parties shall comply.']);
  });

  it('persists additionalOrderTextArray as empty when every slot is blank', async () => {
    await runAction(submitCourtIssuedOrderAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocumentStorageId,
      },
      state: {
        caseDetail: { docketNumber: '111-20' },
        form: {
          documentType: 'Order',
          primaryDocumentFile: {},
          additionalOrderTextArray: ['', ' '],
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedOrderInteractor.mock
        .calls[0][1].documentMetadata.additionalOrderTextArray,
    ).toEqual([]);
  });
});
