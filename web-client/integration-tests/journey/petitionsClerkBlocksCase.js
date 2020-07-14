import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

const {
  DOCKET_NUMBER_SUFFIXES,
  STATUS_TYPES,
} = applicationContext.getConstants();

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
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          status: STATUS_TYPES.generalDocketReadyForTrial,
        }),
      ]),
    );
  });
};
