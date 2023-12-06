import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocketNumbersForConsolidatedServiceAction } from './getDocketNumbersForConsolidatedServiceAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocketNumbersForConsolidatedServiceAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockDocketEntryId = '1234';
  const baseDocketEntries = [
    {
      docketEntryId: mockDocketEntryId,
      documentTitle: 'cool title',
    },
  ];

  it('should return an empty list when the docket entry is multi-docketable and being filed on a non-lead case', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: baseDocketEntries,
            docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'A',
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
              ],
            },
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });

  it('should return an empty list when the docket entry is not multi-docketable', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: baseDocketEntries,
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'PSDE',
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
              ],
            },
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });

  it('should return an empty list when the docket entry is a simultaneous document', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                documentTitle: 'a title',
                eventCode: 'SIAB',
              },
            ],
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'PSDE',
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
              ],
            },
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });

  it('should return an empty list when the docket entry has "Simultaneous" in the doc title', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                documentTitle: 'Simultaneous!!!',
              },
            ],
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'PSDE',
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
              ],
            },
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });

  it('should return the checked member case docket numbers for a multi-docketable docket entry being filed on a lead case', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: baseDocketEntries,
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'A',
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_CASE.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
                {
                  checked: false,
                  docketNumber: 'I should not show up',
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
                {
                  checked: true,
                  docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                  leadDocketNumber: MOCK_CASE.docketNumber,
                },
              ],
            },
          },
        },
      },
    );

    expect(output).toEqual({
      docketNumbers: [MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber],
    });
  });

  it('should return an empty list when the docket entry is multi-docketable, being filed on a lead case, but form.consolidatedCasesToMultiDocketOn is undefined', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: baseDocketEntries,
            docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: 'A',
          },
          modal: {
            form: {},
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });
});
