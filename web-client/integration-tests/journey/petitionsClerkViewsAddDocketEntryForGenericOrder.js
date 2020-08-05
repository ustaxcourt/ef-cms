export const petitionsClerkViewsAddDocketEntryForGenericOrder = test => {
  return it('Petitions clerk views Add Docket Entry form for generic order', async () => {
    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');
    expect(test.getState('form.freeText')).toEqual(test.freeText);
  });
};
