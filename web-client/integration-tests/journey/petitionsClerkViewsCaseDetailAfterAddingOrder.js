export default test => {
  return it('Petitions clerk views case detail after adding order', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('New');
    expect(test.getState('caseDetail.documents').length).toEqual(3);
    expect(test.getState('caseDetail.documents.2')).toMatchObject({
      documentTitle: 'Order of Dismissal and Decision',
    });
  });
};
