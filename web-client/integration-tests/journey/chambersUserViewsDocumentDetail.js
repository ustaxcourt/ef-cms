export default test => {
  return it('Chambers user views document detail', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
    expect(test.getState('editDocumentEntryPoint')).toEqual('DocumentDetail');
  });
};
