export const trialClerkViewsTrialSessionWorkingCopy = cerebralTest => {
  return it('Trial Clerk views trial session working copy', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
    expect(
      cerebralTest.getState('trialSessionWorkingCopy.trialSessionId'),
    ).toEqual(cerebralTest.trialSessionId);
    expect(
      cerebralTest.getState('trialSessionWorkingCopy.filters.showAll'),
    ).toEqual(true);
    expect(cerebralTest.getState('trialSessionWorkingCopy.sort')).toEqual(
      'docket',
    );
    expect(cerebralTest.getState('trialSessionWorkingCopy.sortOrder')).toEqual(
      'asc',
    );
    expect(cerebralTest.getState('trialSession.caseOrder').length).toEqual(1);
  });
};
