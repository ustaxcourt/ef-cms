export const petitionsClerkViewsSignDraftDocument = cerebralTest => {
  return it('Petitions clerk views sign draft document', async () => {
    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
  });
};
