export const docketClerkEditsOrderAndChecksAddedDocketNumbers =
  cerebralTest => {
    return it('Docket Clerk confirms the added docket number when editing the draft document', async () => {
      cerebralTest.setState('addedDocketNumbers', undefined);

      await cerebralTest.runSequence('gotoEditOrderSequence', {
        docketEntryIdToEdit: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('openAddDocketNumbersModalSequence');

      expect(cerebralTest.getState('addedDocketNumbers')).toEqual(
        expect.arrayContaining(['111-19L', '112-19L', '113-19L']),
      );
    });
  };
