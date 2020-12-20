import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const judgeViewsTrialSessionWorkingCopy = (
  test,
  checkCase,
  calendarNote,
) => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('Judge views trial session working copy', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: test.getState(),
      },
    );

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

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == test.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
