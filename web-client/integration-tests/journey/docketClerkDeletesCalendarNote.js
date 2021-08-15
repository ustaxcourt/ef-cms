import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkDeletesCalendarNote = cerebralTest => {
  return it('Docket Clerk deletes calendar note', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    let caseDetail = cerebralTest.getState('caseDetail');

    await cerebralTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    expect(cerebralTest.getState('modal.notes')).toEqual(
      caseDetail.trialSessionNotes,
    );

    await cerebralTest.runSequence('deleteCalendarNoteSequence');
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Note deleted.',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    caseDetail = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(caseDetail.trialSessionNotes).toBe(null);
    cerebralTest.calendarNote = null;
  });
};
