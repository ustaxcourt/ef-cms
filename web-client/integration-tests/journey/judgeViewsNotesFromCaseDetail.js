export const judgeViewsNotesFromCaseDetail = cerebralTest => {
  return it('Judge views added notes from case detail', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('judgesNote.notes')).toEqual(
      'this is a note added from the modal',
    );
  });
};
