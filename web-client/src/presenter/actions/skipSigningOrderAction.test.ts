import { ConsolidatedCasesWithCheckboxInfoType } from '@web-client/presenter/actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { skipSigningOrderAction } from './skipSigningOrderAction';

describe('skipSigningOrderAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('should redirect to the draft documents', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.path).toEqual('/case-detail/123-19/draft-documents');
  });

  it('should set a success message with documentTitle', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('should set a success message with documentType if documentTitle is not set', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('should set created document success message if isCreatingOrder is set', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
        isCreatingOrder: true,
      },
    });
    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });

  it('should set the meta data of the success message with the selected consolidated cases', async () => {
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
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });
    expect(result.output.alertSuccess.metaData).toEqual('101-20');
  });
});
