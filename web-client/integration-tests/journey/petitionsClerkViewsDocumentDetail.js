export default test => {
  return it('Petitions Clerk views document detail', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });
    expect(test.getState('currentPage')).toEqual('DocumentDetail');
    expect(test.getState('editDocumentEntryPoint')).toEqual('DocumentDetail');
  });
};
