import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkDeletesCalendarNote = test => {
  return it('Docket Clerk deletes calendar note', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    let caseDetail = test.getState('caseDetail');

    await test.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    expect(test.getState('modal.notes')).toEqual(caseDetail.trialSessionNotes);

    await test.runSequence('deleteCalendarNoteSequence');
    expect(test.getState('alertSuccess.message')).toEqual('Note deleted.');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    caseDetail = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(caseDetail.trialSessionNotes).toBe(null);
    test.calendarNote = null;
  });
};
