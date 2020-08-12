import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

export const judgeViewsTrialSessionWorkingCopy = test => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('Judge views trial session working copy', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');
    expect(test.getState('trialSessionWorkingCopy.trialSessionId')).toEqual(
      test.trialSessionId,
    );
    expect(test.getState('trialSessionWorkingCopy.filters.showAll')).toEqual(
      true,
    );
    expect(test.getState('trialSessionWorkingCopy.sort')).toEqual(
      DOCKET_SECTION,
    );
    expect(test.getState('trialSessionWorkingCopy.sortOrder')).toEqual('asc');
    expect(test.getState('trialSession.caseOrder').length).toEqual(1);
  });
};
