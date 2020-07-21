import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkBlocksCase = (test, trialLocation) => {
  return it('Petitions clerk blocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeFalsy();

    await test.runSequence('blockCaseFromTrialSequence');

    expect(test.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await test.runSequence('blockCaseFromTrialSequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Case blocked from being set for trial.',
    );
    expect(test.getState('caseDetail').blocked).toBeTruthy();
    expect(test.getState('caseDetail').blockedReason).toEqual('just because');

    await refreshElasticsearchIndex();

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(test.getState('blockedCases')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          blocked: true,
          blockedReason: 'just because',
          caseCaption:
            'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
          docketNumber: test.docketNumber,
          docketNumberSuffix: 'S',
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      ]),
    );
  });
};
