export const docketClerkUpdatesCaseStatusTo = (
  cerebralTest,
  caseStatusToUpdateTo,
) => {
  return it(`Docket clerk updates case status to ${caseStatusToUpdateTo}`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const currentStatus = cerebralTest.getState('caseDetail.status');

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(cerebralTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: caseStatusToUpdateTo,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      caseStatusToUpdateTo,
    );
    expect(cerebralTest.getState('modal')).toEqual({});
  });
};
