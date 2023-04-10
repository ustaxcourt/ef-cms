export const petitionsClerkViewsAddDocketEntryForGenericOrder =
  cerebralTest => {
    return it('Petitions clerk views Add Docket Entry form for generic order', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CourtIssuedDocketEntry',
      );
      expect(cerebralTest.getState('form.freeText')).toEqual(
        cerebralTest.freeText,
      );
    });
  };
