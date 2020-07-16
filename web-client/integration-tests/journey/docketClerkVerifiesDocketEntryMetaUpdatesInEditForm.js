export const docketClerkVerifiesDocketEntryMetaUpdatesInEditForm = test => {
  return it('docket clerk verifies docket entry meta updates in edit form', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

    expect(test.getState('form.hasOtherFilingParty')).toBe(true);
    expect(test.getState('form.otherFilingParty')).toBe('Brianna Noble');
  });
};
