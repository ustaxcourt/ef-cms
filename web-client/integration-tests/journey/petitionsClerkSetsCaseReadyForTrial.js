const { Case } = require('../../../shared/src/business/entities/cases/Case');

export default test => {
  return it('Petitions clerk set a case ready for trial', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );

    await test.runSequence('setCaseToReadyForTrialSequence');

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocketReadyForTrial,
    );
  });
};
