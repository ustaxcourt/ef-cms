import { runAction } from '@web-client/presenter/test.cerebral';
import { setPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/setPendingMotionDocketEntriesForCurrentJudgeAction';

describe('setPendingMotionDocketEntriesForCurrentJudgeAction', () => {
  const TEST_DOCKET_NUMBER = 'TEST_DOCKET_NUMBER';
  const TEST_DOCKET_ENTRY_ID = 'TEST_DOCKET_ENTRY_ID';
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

  it('should set pending motion docket entries in state', async () => {
    const results = await runAction(
      setPendingMotionDocketEntriesForCurrentJudgeAction,
      {
        props: {
          docketEntries: TEST_DOCKET_ENTRIES,
        },

        state: {
          pendingMotions: {
            docketEntries: undefined,
          },
        },
      },
    );

    const { docketEntries } = results.state.pendingMotions;
    expect(docketEntries).toEqual(TEST_DOCKET_ENTRIES);
  });
});
