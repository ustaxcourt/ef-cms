import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkUnblocksCase = (
  cerebralTest,
  trialLocation,
  checkReport = true,
) => {
  return it('Petitions clerk unblocks the case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail').blocked).toBeTruthy();

    await cerebralTest.runSequence('unblockCaseFromTrialSequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Block removed. Case is eligible for next available trial session.',
    );
    expect(cerebralTest.getState('caseDetail').blocked).toBeFalsy();
    expect(cerebralTest.getState('caseDetail').blockedReason).toBeUndefined();

    if (checkReport) {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

      await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
        key: 'trialLocation',
        value: trialLocation,
      });

      expect(cerebralTest.getState('blockedCases')).toMatchObject([]);
    }
  });
};
