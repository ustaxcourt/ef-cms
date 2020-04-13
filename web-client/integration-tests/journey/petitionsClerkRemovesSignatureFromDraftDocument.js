export default test => {
  return it('Petitions clerk removes saved signature from draft document', async () => {
    await test.runSequence('removeSignatureFromOrderSequence', {
      caseDetail: test.getState('caseDetail'),
      documentIdToEdit: test.documentId,
    });

    expect(test.getState('alertSuccess.message')).toEqual('Signature removed.');
  });
};
