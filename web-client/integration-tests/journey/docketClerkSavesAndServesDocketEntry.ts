import { getFormattedDocketEntriesForTest, waitForCondition } from '../helpers';

export const docketClerkSavesAndServesDocketEntry = cerebralTest => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await cerebralTest.runSequence('submitPaperFilingSequence');

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    cerebralTest.docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'ADMR',
    );

    expect(cerebralTest.docketRecordEntry.index).toBeTruthy();
  });
};
