export const docketClerkVerifiesEditCourtIssuedNonstandardFields =
  cerebralTest => {
    return it('docket clerk verifies that nonstandard fields are displayed on court-issued docket entry edit form', async () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(cerebralTest.getState('form.freeText')).toEqual('be free');
      expect(cerebralTest.getState('form.month')).toEqual('4');
      expect(cerebralTest.getState('form.day')).toEqual('4');
      expect(cerebralTest.getState('form.year')).toEqual('2050');
    });
  };
