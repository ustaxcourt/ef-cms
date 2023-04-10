export const trialClerkViewsNotesFromCaseDetail = cerebralTest => {
  return it('Trial Clerk views added notes from case detail', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('judgesNote.notes')).toEqual(undefined);
    expect(cerebralTest.getState('caseDetail.judgesNote.notes')).toEqual(
      undefined,
    );
  });
};
