export const docketClerkVerifiesEditCourtIssuedNonstandardFields =
  cerebralTest => {
    return it('docket clerk verifies that nonstandard fields are displayed on court-issued docket entry edit form', () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(cerebralTest.getState('form.freeText')).toEqual('be free');
      expect(cerebralTest.getState('form.date')).toEqual(
        '2050-04-04T00:00:00.000-04:00',
      );
    });
  };
