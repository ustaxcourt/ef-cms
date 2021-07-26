export const docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge =
  cerebralTest => {
    return it('docket clerk verifies that nonstandard judge field is populated on court-issued docket entry edit form', () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(cerebralTest.getState('form.freeText')).toEqual('for Something');
      expect(cerebralTest.getState('form.judge')).toEqual('Buch');
    });
  };
