export const docketClerkViewsEditDocketRecord = test => {
  return it('Docket clerk views Edit Docket Record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketEntryId: test.docketRecordEntry.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
  });
};
