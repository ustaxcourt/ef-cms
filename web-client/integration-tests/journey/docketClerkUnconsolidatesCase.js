export const docketClerkUnconsolidatesCase = test => {
  it('Docket clerk unconsolidate a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.leadDocketNumber,
    });

    await test.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(test.getState('modal.showModal')).toEqual('UnconsolidateCasesModal');
    const currentCaseId = test.getState('caseDetail.caseId');

    await test.runSequence('updateModalValueSequence', {
      key: `casesToRemove.${currentCaseId}`,
      value: true,
    });

    await test.runSequence('submitRemoveConsolidatedCasesSequence');

    expect(test.getState('caseDetail.leadCaseId')).toBeUndefined();
    expect(test.getState('caseDetail.consolidatedCases').length).toEqual(0);
  });
};
