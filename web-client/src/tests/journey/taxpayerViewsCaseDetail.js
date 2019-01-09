export default test => {
  return it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailPetitioner');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.documents').length).toEqual(1);
    await test.runSequence('viewDocumentSequence', {
      documentId: test.getState('caseDetail.documents.0.documentId'),
      callback: documentBlob => {
        expect(documentBlob).toBeTruthy();
      },
    });
  });
};
