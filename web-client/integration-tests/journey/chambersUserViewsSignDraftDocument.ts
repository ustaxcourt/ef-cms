export const chambersUserViewsSignDraftDocument = cerebralTest => {
  return it('Chambers user views sign draft document', async () => {
    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
  });
};
