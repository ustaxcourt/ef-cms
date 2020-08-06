export const docketClerkUnconsolidatesCase = test => {
  it('Docket clerk unconsolidate a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.leadDocketNumber,
    });

    await test.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(test.getState('modal.showModal')).toEqual('UnconsolidateCasesModal');
    const currentDocketNumber = test.getState('caseDetail.docketNumber');

    await test.runSequence('updateModalValueSequence', {
      key: `casesToRemove.${currentDocketNumber}`,
      value: true,
    });

    await test.runSequence('submitRemoveConsolidatedCasesSequence');

    expect(test.getState('caseDetail.leadDocketNumber')).toBeUndefined();
    expect(test.getState('caseDetail.consolidatedCases').length).toEqual(0);
  });
};
