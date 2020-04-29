export const docketClerkVerifiesEditCourtIssuedNonstandardFields = test => {
  return it('docket clerk verifies that nonstandard fields are displayed on court-issued docket entry edit form', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

    expect(test.getState('form.freeText')).toEqual('be free');
    expect(test.getState('form.month')).toEqual('4');
    expect(test.getState('form.day')).toEqual('4');
    expect(test.getState('form.year')).toEqual('2050');
  });
};
