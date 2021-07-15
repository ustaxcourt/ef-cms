const {
  CASE_STATUS_TYPES,
} = require('../../../shared/src/business/entities/EntityConstants');

export const docketClerkSetsCaseReadyForTrial = cerebralTest => {
  return it('Docket clerk sets a case ready for trial', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );

    if (cerebralTest.casesReadyForTrial) {
      cerebralTest.casesReadyForTrial.push(cerebralTest.getState('caseDetail'));
    }
  });
};
