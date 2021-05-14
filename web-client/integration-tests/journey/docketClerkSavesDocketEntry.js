import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkSavesDocketEntry = test => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const {
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test);

    test.docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Administrative Record',
    );

    expect(test.docketRecordEntry.index).toBeFalsy();
  });
};
