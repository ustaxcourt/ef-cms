export const petitionsClerkViewsSignDraftDocument = test => {
  return it('Petitions clerk views sign draft document', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    expect(test.getState('currentPage')).toEqual('SignOrder');
  });
};
