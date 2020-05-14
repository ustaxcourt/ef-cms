import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkUnblocksCase = (
  test,
  trialLocation,
  checkReport = true,
) => {
  return it('Petitions clerk unblocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeTruthy();

    await test.runSequence('unblockCaseFromTrialSequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Block removed. Case is eligible for next available trial session.',
    );
    expect(test.getState('caseDetail').blocked).toBeFalsy();
    expect(test.getState('caseDetail').blockedReason).toBeUndefined();

    if (checkReport) {
      await refreshElasticsearchIndex();

      await test.runSequence('gotoBlockedCasesReportSequence');

      await test.runSequence('getBlockedCasesByTrialLocationSequence', {
        key: 'trialLocation',
        value: trialLocation,
      });

      expect(test.getState('blockedCases')).toMatchObject([]);
    }
  });
};
