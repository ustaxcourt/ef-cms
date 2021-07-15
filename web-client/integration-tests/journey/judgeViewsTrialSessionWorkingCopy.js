import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const judgeViewsTrialSessionWorkingCopy = (
  cerebralTest,
  checkCase,
  calendarNote,
) => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('Judge views trial session working copy', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
    expect(
      cerebralTest.getState('trialSessionWorkingCopy.trialSessionId'),
    ).toEqual(cerebralTest.trialSessionId);
    expect(
      cerebralTest.getState('trialSessionWorkingCopy.filters.showAll'),
    ).toEqual(true);
    expect(cerebralTest.getState('trialSessionWorkingCopy.sort')).toEqual(
      DOCKET_SECTION,
    );
    expect(cerebralTest.getState('trialSessionWorkingCopy.sortOrder')).toEqual(
      'asc',
    );
    expect(cerebralTest.getState('trialSession.caseOrder').length).toEqual(1);

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == cerebralTest.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
