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
});
