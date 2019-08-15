export default test => {
  return it('Docket clerk views Edit Docket Record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    await test.runSequence('gotoEditDocketEntry', {
      documentId: test.docketRecordEntry.documentId,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
  });
};
