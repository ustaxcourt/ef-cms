export const docketClerkManuallyAddsCaseToTrialSessionWithNote = test => {
  return it('docket clerk manually adds case to trial session with a note', async () => {
    const mockTestNote = 'test note';

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

    await test.runSequence('updateModalValueSequence', {
      key: 'calendarNotes',
      value: mockTestNote,
    });

    await test.runSequence('addCaseToTrialSessionSequence');

    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.createdTrialSessions[0],
    });

    const caseOrder = test.getState('trialSession.caseOrder');

    const caseFromCaseOrder = caseOrder.find(
      c => c.docketNumber === test.docketNumber,
    );

    expect(caseFromCaseOrder.calendarNotes).toEqual(mockTestNote);
    test.calendarNote = mockTestNote;
  });
};
