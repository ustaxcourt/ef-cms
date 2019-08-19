export default test => {
  return it('Docket clerk views Edit Docket Record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoEditDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: test.docketRecordEntry.documentId,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
  });
};
