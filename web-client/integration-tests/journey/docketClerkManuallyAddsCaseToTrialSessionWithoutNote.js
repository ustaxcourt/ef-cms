export const docketClerkManuallyAddsCaseToTrialSessionWithoutNote = test => {
  return it('Docket Clerk manually adds case to trial session without a note', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openAddToTrialModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.createdTrialSessions[0],
    });

    await test.runSequence('addCaseToTrialSessionSequence');

    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.createdTrialSessions[0],
    });

    const caseOrder = test.getState('trialSession.caseOrder');

    const caseFromCaseOrder = caseOrder.find(
      c => c.docketNumber === test.docketNumber,
    );

    expect(caseFromCaseOrder.calendarNotes).toBe(undefined);
    test.calendarNote = undefined;
  });
};
