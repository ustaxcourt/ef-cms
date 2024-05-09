import { ConsolidatedCasesWithCheckboxInfoType } from '@web-client/presenter/actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePdfInteractor,
    ).toHaveBeenCalled();
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
