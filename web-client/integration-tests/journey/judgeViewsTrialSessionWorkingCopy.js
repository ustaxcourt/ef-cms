export default test => {
  return it('Judge views trial session working copy', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');
    expect(test.getState('trialSessionWorkingCopy.trialSessionId')).toEqual(
      test.trialSessionId,
    );
    expect(test.getState('trialSessionWorkingCopy.filters.showAll')).toEqual(
      true,
    );
    expect(test.getState('trialSessionWorkingCopy.sort')).toEqual('docket');
    expect(test.getState('trialSessionWorkingCopy.sortOrder')).toEqual('asc');
    expect(test.getState('trialSession.caseOrder').length).toEqual(1);
  });
};
