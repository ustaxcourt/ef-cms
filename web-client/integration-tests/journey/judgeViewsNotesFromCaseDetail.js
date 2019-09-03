export default test => {
  return it('Judge views added notes from case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.caseNote.notes')).toEqual(
      'this is a note added from the modal',
    );
  });
};
