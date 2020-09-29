export const petitionsClerkViewsAddDocketEntryForGenericOrder = test => {
  return it('Petitions clerk views Add Docket Entry form for generic order', async () => {
    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');
    expect(test.getState('form.freeText')).toEqual(test.freeText);
  });
};
