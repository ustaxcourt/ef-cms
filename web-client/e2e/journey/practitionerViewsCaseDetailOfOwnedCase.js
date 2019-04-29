export default test => {
  return it('Practitioner views case detail of owned case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.practitioners.0.name')).toEqual(
      'Test Practitioner',
    );
  });
};
