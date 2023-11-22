import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketEntryWorksheetAction } from '@web-client/presenter/actions/PendingMotion/setDocketEntryWorksheetAction';

describe('setDocketEntryWorksheetAction', () => {
  const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';
  const TEST_WORKSHEET = {
    docketEntryId: TEST_DOCKET_ENTRY_ID,
    primaryIssue: 'SOME TEST PRIMARY ISSUE',
  };
  const TEST_DOCKET_ENTRIES = [
    {
      docketEntryId: 'RANDOM ENTRY',
      docketEntryWorksheet: {
        docketEntryId: 'RANDOM ENTRY',
      },
      docketNumber: TEST_DOCKET_NUMBER,
    },
    {
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      docketEntryWorksheet: {
        docketEntryId: TEST_DOCKET_ENTRY_ID,
      },
      docketNumber: TEST_DOCKET_NUMBER,
    },
  ];

  it('should update the correct docket entry worksheet in state', async () => {
    const results = await runAction(setDocketEntryWorksheetAction, {
      props: {
        updatedWorksheet: TEST_WORKSHEET,
      },

      state: {
        pendingMotions: {
          docketEntries: TEST_DOCKET_ENTRIES,
        },
      },
    });

    const { docketEntries } = results.state.pendingMotions;
    expect(docketEntries).toEqual([
      TEST_DOCKET_ENTRIES[0],
      {
        docketEntryId: TEST_DOCKET_ENTRY_ID,
        docketEntryWorksheet: {
          docketEntryId: TEST_DOCKET_ENTRY_ID,
          primaryIssue: 'SOME TEST PRIMARY ISSUE',
        },
        docketNumber: TEST_DOCKET_NUMBER,
      },
    ]);
  });
});
