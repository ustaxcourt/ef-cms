import { DocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditDocketEntryWorksheetModalStateAction } from '@web-client/presenter/actions/PendingMotion/setAddEditDocketEntryWorksheetModalStateAction';

describe('setAddEditDocketEntryWorksheetModalStateAction', () => {
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';
  const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';

  const TEST_DOCKET_ENTRIES = [
    {
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      docketEntryWorksheet: {
        docketEntryId: TEST_DOCKET_ENTRY_ID,

        worksheetProp1: 'worksheetProp1',
        worksheetProp2: 'worksheetProp2',
        worksheetProp3: 'worksheetProp3',
      },
      docketNumber: TEST_DOCKET_NUMBER,
    },
  ];

  it('should set state correctly for modal', async () => {
    const results = await runAction(
      setAddEditDocketEntryWorksheetModalStateAction,
      {
        props: {
          docketEntryId: TEST_DOCKET_ENTRY_ID,
        },

        state: {
          form: {},
          pendingMotions: {
            docketEntries: TEST_DOCKET_ENTRIES,
          },
        },
      },
    );

    expect(results.state.form).toEqual({
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      docketNumber: TEST_DOCKET_NUMBER,
      worksheetProp1: 'worksheetProp1',
      worksheetProp2: 'worksheetProp2',
      worksheetProp3: 'worksheetProp3',
    });
  });

  it('should normalize a finalBriefDueDate that the API returned as an ISO timestamp to YYYY-MM-DD', async () => {
    const results = await runAction(
      setAddEditDocketEntryWorksheetModalStateAction,
      {
        props: {
          docketEntryId: TEST_DOCKET_ENTRY_ID,
        },
        state: {
          form: {},
          pendingMotions: {
            docketEntries: [
              {
                docketEntryId: TEST_DOCKET_ENTRY_ID,
                docketEntryWorksheet: {
                  docketEntryId: TEST_DOCKET_ENTRY_ID,
                  finalBriefDueDate: '2026-08-07T04:00:00.000Z',
                },
                docketNumber: TEST_DOCKET_NUMBER,
              },
            ],
          },
        },
      },
    );

    expect(results.state.form.finalBriefDueDate).toBe('2026-08-07');
    expect(
      new DocketEntryWorksheet(results.state.form).getFormattedValidationErrors(),
    ).not.toHaveProperty('finalBriefDueDate');
  });
});
