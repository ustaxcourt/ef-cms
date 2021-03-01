import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { getTextByCount } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkEditsHearingNote = (test, updatedNote) => {
  return it('Docket Clerk updates the note on a hearing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    let caseDetail = test.getState('caseDetail');
    caseDetail = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    let hearing = caseDetail.hearings[caseDetail.hearings.length - 1];

    await test.runSequence('openAddEditCalendarNoteModalSequence', {
      docketNumber: caseDetail.docketNumber,
      note: hearing.calendarNotes,
      trialSessionId: hearing.trialSessionId,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'note',
      value: '',
    });

    await test.runSequence('updateHearingNoteSequence');
    expect(test.getState('validationErrors')).toEqual({
      note: 'Add a note',
    });

    const textWithCountOverLimit = getTextByCount(201);

    await test.runSequence('updateModalValueSequence', {
      key: 'note',
      value: textWithCountOverLimit,
    });

    await test.runSequence('updateHearingNoteSequence');
    expect(test.getState('validationErrors')).toEqual({
      note: 'Limit is 200 characters. Enter 200 or fewer characters.',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await test.runSequence('updateHearingNoteSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertSuccess').message).toEqual('Note saved.');

    caseDetail = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const updatedHearing = caseDetail.hearings.find(
      caseHearing => caseHearing.trialSessionId === hearing.trialSessionId,
    );

    expect(updatedHearing.calendarNotes).toEqual(updatedNote);
  });
};
