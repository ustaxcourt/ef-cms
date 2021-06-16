import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkSavesAndServesDocketEntry = test => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await test.runSequence('submitPaperFilingSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    test.docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'ADMR',
    );

    expect(test.docketRecordEntry.index).toBeTruthy();
  });
};
