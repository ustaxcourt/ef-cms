export default test => {
  return it('Chambers user views sign draft document', async () => {
    await test.runSequence('gotoSignPDFDocumentSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
      pageNumber: 1,
    });

    expect(test.getState('currentPage')).toEqual('SignStipDecision');
  });
};
