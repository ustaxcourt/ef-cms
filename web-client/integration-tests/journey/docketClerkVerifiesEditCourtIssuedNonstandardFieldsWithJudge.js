export const docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge =
  test => {
    return it('docket clerk verifies that nonstandard judge field is populated on court-issued docket entry edit form', async () => {
      expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

      expect(test.getState('form.freeText')).toEqual('for Something');
      expect(test.getState('form.judge')).toEqual('Buch');
    });
  };
