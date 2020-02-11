export default test => {
  return it('Judge views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.blocked).toBeDefined();
    expect(caseDetail.blockedDate).toBeDefined();
    expect(caseDetail.blockedReason).toBeDefined();
    expect(caseDetail.caseNote).toBeDefined();
    expect(caseDetail.highPriority).toBeDefined();
    expect(caseDetail.highPriorityReason).toBeDefined();
    expect(caseDetail.qcCompleteForTrial).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(caseDetail.userId).toBeDefined();
    expect(caseDetail.workItems).toBeDefined();
  });
};
