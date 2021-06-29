import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddEditsCalendarNote = (test, addingOrEditing) => {
  return it(`Docket Clerk ${addingOrEditing} calendar note`, async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    let caseDetail = test.getState('caseDetail');

    await test.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    expect(test.getState('modal.notes')).toEqual(caseDetail.trialSessionNotes);

    await test.runSequence('clearModalFormSequence');

    caseDetail = test.getState('caseDetail');

    expect(test.getState('modal.notes')).toEqual(caseDetail.trialSessionNotes);

    await test.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    const updatedNote = 'This is a new note';
    await test.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await test.runSequence('updateCalendarNoteSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertSuccess.message')).toEqual('Note saved.');

    caseDetail = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(caseDetail.trialSessionNotes).toEqual(updatedNote);
    test.calendarNote = caseDetail.trialSessionNotes;
  });
};
