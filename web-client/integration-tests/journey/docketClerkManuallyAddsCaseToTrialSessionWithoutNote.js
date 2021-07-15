export const docketClerkManuallyAddsCaseToTrialSessionWithoutNote =
  cerebralTest => {
    return it('Docket Clerk manually adds case to trial session without a note', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('openAddToTrialModalSequence');

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'showAllLocations',
        value: true,
      });

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'trialSessionId',
        value: cerebralTest.createdTrialSessions[0],
      });

      await cerebralTest.runSequence('addCaseToTrialSessionSequence');

      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.createdTrialSessions[0],
      });

      const caseOrder = cerebralTest.getState('trialSession.caseOrder');

      const caseFromCaseOrder = caseOrder.find(
        c => c.docketNumber === cerebralTest.docketNumber,
      );

      expect(caseFromCaseOrder.calendarNotes).toBe(undefined);
      cerebralTest.calendarNote = undefined;
    });
  };
