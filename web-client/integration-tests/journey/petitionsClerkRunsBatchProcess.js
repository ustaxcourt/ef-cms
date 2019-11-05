import { Case } from '../../../shared/src/business/entities/cases/Case';

export default test => {
  return it('Petitions clerk runs batch process', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.batchedForIRS,
    );

    await test.runSequence('runBatchProcessSequence');

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );
  });
};
