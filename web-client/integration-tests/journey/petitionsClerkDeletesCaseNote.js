export const petitionsClerkDeletesCaseNote = cerebralTest => {
  return it('petitions clerk deletes case note from a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );

    await cerebralTest.runSequence('openDeleteCaseNoteConfirmModalSequence');

    await cerebralTest.runSequence('deleteCaseNoteSequence');

    expect(cerebralTest.getState('caseDetail.caseNote')).toBeUndefined();
  });
};
