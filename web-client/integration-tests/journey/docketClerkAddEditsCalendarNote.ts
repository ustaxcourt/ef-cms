import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddEditsCalendarNote = (
  cerebralTest,
  addingOrEditing,
) => {
  return it(`Docket Clerk ${addingOrEditing} calendar note`, async () => {
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

    await cerebralTest.runSequence('clearModalFormSequence');

    caseDetail = cerebralTest.getState('caseDetail');

    expect(cerebralTest.getState('modal.notes')).toEqual(
      caseDetail.trialSessionNotes,
    );

    await cerebralTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    const updatedNote = 'This is a new note';
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await cerebralTest.runSequence('updateCalendarNoteSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Note saved.',
    );

    caseDetail = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(caseDetail.trialSessionNotes).toEqual(updatedNote);
    cerebralTest.calendarNote = caseDetail.trialSessionNotes;
  });
};
