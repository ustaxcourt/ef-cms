export const petitionsClerkViewsSignDraftDocument = test => {
  return it('Petitions clerk views sign draft document', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('SignOrder');
  });
};
