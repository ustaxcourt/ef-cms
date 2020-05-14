export const petitionsClerkViewsSignDraftDocument = test => {
  return it('Petitions clerk views sign draft document', async () => {
    await test.runSequence('gotoSignPDFDocumentSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
      pageNumber: 1,
    });

    expect(test.getState('currentPage')).toEqual('SignStipDecision');
  });
};
