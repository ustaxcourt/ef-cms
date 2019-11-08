const { Case } = require('../../../shared/src/business/entities/cases/Case');

export default test => {
  return it('Docket clerk sets a case ready for trial', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );

    await test.runSequence('openUpdateCaseModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocketReadyForTrial,
    );

    if (test.casesReadyForTrial) {
      test.casesReadyForTrial.push(test.getState('caseDetail'));
    }
  });
};
