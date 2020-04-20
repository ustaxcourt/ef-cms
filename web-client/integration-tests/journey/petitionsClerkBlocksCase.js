import { Case } from '../../../shared/src/business/entities/cases/Case';
import { refreshElasticsearchIndex } from '../helpers';

export default (test, trialLocation) => {
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

    expect(test.getState('alertSuccess').title).toEqual(
      'This case is now blocked from being set for trial',
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
            'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Deceased, Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Surviving Spouse, Petitioner',
          docketNumber: test.docketNumber,
          docketNumberSuffix: 'S',
          status: Case.STATUS_TYPES.generalDocketReadyForTrial,
        }),
      ]),
    );
  });
};
