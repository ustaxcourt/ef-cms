export default test => {
  return it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const caseDetail = test.getState('caseDetail');
    expect(test.getState('currentPage')).toEqual('CaseDetailPetitioner');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.documents.length).toEqual(1);
    expect(caseDetail.preferredTrialCity).toEqual('Chattanooga, TN');
    expect(caseDetail.caseType).toEqual('noticeOfDeficiency');
    expect(caseDetail.procedureType).toEqual('Regular');
    await test.runSequence('viewDocumentSequence', {
      documentId: test.getState('caseDetail.documents.0.documentId'),
      callback: documentBlob => {
        expect(documentBlob).toBeTruthy();
      },
    });
  });
};
