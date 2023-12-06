import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

const { STATUS_TYPES } = applicationContext.getConstants();

export const petitionsClerkBlocksCase = (
  cerebralTest,
  trialLocation,
  overrides = {},
) => {
  return it('Petitions clerk blocks the case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail').blocked).toBeFalsy();

    await cerebralTest.runSequence('blockCaseFromTrialSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await cerebralTest.runSequence('blockCaseFromTrialSequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Case blocked from being set for trial.',
    );
    expect(cerebralTest.getState('caseDetail').blocked).toBeTruthy();
    expect(cerebralTest.getState('caseDetail').blockedReason).toEqual(
      'just because',
    );

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          blocked: true,
          blockedDate: expect.anything(),
          blockedReason: 'just because',
          caseCaption:
            overrides.caseCaption ||
            'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
          docketNumber: cerebralTest.docketNumber,
          docketNumberSuffix: overrides.docketNumberSuffix || null,
          status:
            overrides.caseStatus || STATUS_TYPES.generalDocketReadyForTrial,
        }),
      ]),
    );
  });
};
