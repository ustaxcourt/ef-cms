export const docketClerkUnconsolidatesCase = cerebralTest => {
  it('Docket clerk unconsolidate a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UnconsolidateCasesModal',
    );
    const currentDocketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `casesToRemove.${currentDocketNumber}`,
      value: true,
    });

    await cerebralTest.runSequence('submitRemoveConsolidatedCasesSequence');

    expect(
      cerebralTest.getState('caseDetail.leadDocketNumber'),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(0);
  });
};
